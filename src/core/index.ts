import { computed, ref, watch } from 'vue'
import OpenSIPSJS from 'opensips-js'
import { ITimeData } from 'opensips-js/src/types/timer'
import {
    IOpenSIPSJSOptions,
    ICall,
    IRoom,
    ICallStatus,
    CustomLoggerType,
    IOpenSIPSConfiguration,
    NoiseReductionOptions,
    NoiseReductionOptionsWithoutVadModule
} from 'opensips-js/src/types/rtc'
import { IMessage } from 'opensips-js/src/types/msrp'
import { WebrtcMetricsConfigType } from 'opensips-js/src/types/webrtcmetrics'
import * as VAD from '@ricky0123/vad-web'

import { VsipAPI } from '@/types'
import {
    MSRP_EVT,
    MSRPConversationState,
    MSRPMemberRole,
    MSRPUploadResult,
    MSRPTypingState,
    UnreadCounts
} from '@/types/msrp'

let openSIPSJS: OpenSIPSJS | undefined = undefined

// ---------- Audio / call state ----------
const isInitialized = ref<boolean>(false)
const isOpenSIPSReady = ref<boolean>(false)
const isOpenSIPSReconnecting = ref<boolean>(false)
const allCalls = ref<{ [key: string]: ICall }>({})
const activeMessages = ref<{ [key: string]: IMessage }>({})
const addCallToCurrentRoom = ref<boolean>(false)
const callAddingInProgress = ref<string | undefined>(undefined)
const allRooms = ref<{ [key: number | string]: IRoom }>({})
const availableMediaDevices = ref<Array<MediaDeviceInfo>>([])
const selectedOutputDevice = ref<string>('default')
const selectedInputDevice = ref<string>('default')
const muteWhenJoin = ref<boolean>(false)
const isDND = ref<boolean>(false)
// If false - all incoming calls will be rejected when busy
const isCallWaitingEnabled = ref<boolean>(true)
const isMuted = ref<boolean>(false)
const originalStream = ref<MediaStream | null>(null)
const currentActiveRoomId = ref<number | undefined>(undefined)
const autoAnswer = ref<boolean>(false)
const microphoneInputLevel = ref<number>(2) // [0;2]
const speakerVolume = ref<number>(1) // [0;1]
const callStatus = ref<{ [key: string]: ICallStatus }>({})
const callTime = ref<{ [key: string]: ITimeData }>({})
const callMetrics = ref<{ [key: string]: unknown }>({})
const noiseReductionState = ref<boolean>(false)

// ---------- MSRP session state ----------
const currentMsrpSession = ref<IMessage | null>(null)
const isMSRPInitializing = ref<boolean>(false)

// ---------- MSRP conversation state ----------
// Conversation metadata and chat history are kept as two parallel maps.
// Metadata is small and changes rarely (members, role, state events).
// Messages are fat and churn on every new event - keeping them separate
// prevents message activity from invalidating metadata-only views.
const conversations = ref<{ [key: string]: MSRPConversationState }>({})
const messagesByConversation = ref<{ [conversationKey: string]: any[] }>({})
const typingByConversation = ref<{ [conversationKey: string]: MSRPTypingState }>({})

// ---------- UI-only MSRP state ----------
const currentConversationKey = ref<string | null>(null)
const unreadByConversation = ref<UnreadCounts>({})

const activeCalls = computed(() => {
    const calls: { [key: string]: ICall } = {}
    Object.entries(allCalls.value).forEach(([ key, value ]) => {
        if (!callStatus.value[key]?.isTransferred) {
            calls[key] = value
        }
    })

    return calls
})

const activeRooms = computed(() => {
    const rooms: { [key: number | string]: IRoom } = {}

    const callRoomIds = Object.values(activeCalls.value).map((call) => {
        return call.roomId
    })

    Object.entries(allRooms.value).forEach(([ key, value ]) => {
        if (callRoomIds.includes(value.roomId)) {
            rooms[key] = value
        }
    })

    return rooms
})

const inputMediaDeviceList = computed(() => {
    return availableMediaDevices.value.filter(device => device.kind === 'audioinput').map(device => {
        return {
            deviceId: device.deviceId,
            kind: device.kind,
            groupId: device.groupId,
            label: device.label
        }
    })
})

const outputMediaDeviceList = computed(() => {
    return availableMediaDevices.value.filter(device => device.kind === 'audiooutput').map(device => {
        return {
            deviceId: device.deviceId,
            kind: device.kind,
            groupId: device.groupId,
            label: device.label
        }
    })
})

const callsInActiveRoom = computed(() => {
    return Object.values(activeCalls.value).filter((call) => call.roomId === currentActiveRoomId.value)
})

watch(callsInActiveRoom, (value) => {
    if (!value.length && currentActiveRoomId.value) {
        currentActiveRoomId.value = undefined
    }
})

// ---------- MSRP computed views ----------
const hasActiveMsrpSession = computed(() => currentMsrpSession.value !== null)

const currentConversation = computed<MSRPConversationState | null>(() => {
    const key = currentConversationKey.value
    if (!key) return null
    return conversations.value[key] ?? null
})

const currentMessages = computed<any[]>(() => {
    const key = currentConversationKey.value
    if (!key) return []
    return messagesByConversation.value[key] ?? []
})

const sortedConversations = computed<MSRPConversationState[]>(() => {
    return Object.values(conversations.value).sort(
        (a, b) => (b.updated_at || 0) - (a.updated_at || 0)
    )
})

// ---------- MSRP local helpers ----------
function findMessage (messages: any[], eventId: string) {
    return messages.find((msg: any) => msg.event_id === eventId)
}

/**
 * Apply a live `m.reaction` event to a target message's
 * `reactions_summary` array, mirroring the exact shape the backend
 * returns on sync:
 *     { emoji, count, user_ids, viewer_reacted }
 *
 * Invariant enforced: `count === user_ids.length`. A repeated "add"
 * from the same sender is a no-op; a "remove" from a sender who isn't
 * in `user_ids` is a no-op. `viewer_reacted` is recomputed from
 * `user_ids` so we never depend on a server-supplied value that may be
 * wrong (the backend has been observed to mis-attribute it).
 */
function applyReaction (
    target: any,
    emoji: string,
    action: 'add' | 'remove',
    sender: string,
    viewerUri: string
): void {
    if (!target?.content) return
    if (!Array.isArray(target.content.reactions_summary)) {
        target.content.reactions_summary = []
    }
    const summary = target.content.reactions_summary as any[]
    // Lookup tolerates legacy entries that used `key` instead of `emoji`.
    const existing = summary.find((r) => (r?.emoji || r?.key) === emoji)

    if (action === 'remove') {
        if (!existing) return
        const userIds: string[] = Array.isArray(existing.user_ids) ? existing.user_ids : []
        if (!userIds.includes(sender)) return
        existing.user_ids = userIds.filter((u) => u !== sender)
        existing.count = existing.user_ids.length
        if (existing.count === 0) {
            target.content.reactions_summary = summary.filter(
                (r) => (r?.emoji || r?.key) !== emoji
            )
            return
        }
        existing.viewer_reacted = existing.user_ids.includes(viewerUri)
        return
    }

    if (existing) {
        const userIds: string[] = Array.isArray(existing.user_ids) ? existing.user_ids : []
        if (userIds.includes(sender)) return
        existing.user_ids = [ ...userIds, sender ]
        existing.count = existing.user_ids.length
        if (!existing.emoji) existing.emoji = emoji
        existing.viewer_reacted = existing.user_ids.includes(viewerUri)
        return
    }

    summary.push({
        emoji,
        count: 1,
        user_ids: [ sender ],
        viewer_reacted: sender === viewerUri
    })
}

function resolveLastEventId (conversationKey: string): string | null {
    const messages = messagesByConversation.value[conversationKey]
    if (!messages?.length) return null
    const lastMsg = [ ...messages ]
        .filter((m: any) => m.type === MSRP_EVT.MESSAGE && m.event_id)
        .sort((a: any, b: any) => (a.origin_server_ts || 0) - (b.origin_server_ts || 0))
        .pop()
    return lastMsg?.event_id ?? null
}

function getViewerUri (): string {
    return (openSIPSJS as any)?.configuration?.uri?.toString?.() ?? ''
}

export const vsipAPI: VsipAPI = {
    state: {
        isInitialized,
        isOpenSIPSReady,
        isOpenSIPSReconnecting,
        activeCalls,
        callsInActiveRoom,
        activeMessages,
        addCallToCurrentRoom,
        callAddingInProgress,
        activeRooms,
        availableMediaDevices,
        inputMediaDeviceList,
        outputMediaDeviceList,
        selectedOutputDevice,
        selectedInputDevice,
        muteWhenJoin,
        isDND,
        isCallWaitingEnabled,
        isMuted,
        originalStream,
        currentActiveRoomId,
        callStatus,
        callTime,
        callMetrics,
        noiseReductionState,
        autoAnswer,
        microphoneInputLevel,
        speakerVolume,
        currentMsrpSession,
        isMSRPInitializing,
        hasActiveMsrpSession,
        conversations,
        messagesByConversation,
        currentConversationKey,
        currentConversation,
        currentMessages,
        sortedConversations,
        typingByConversation,
        unreadByConversation,
    },
    actions: {
        init (connectOptions, pnExtraHeaders, opensipsConfiguration = {}, logger?: CustomLoggerType) {
            return new Promise<OpenSIPSJS>(
                (resolve, reject) => {
                    try {
                        const configuration: IOpenSIPSConfiguration = {
                            ...opensipsConfiguration,
                            session_timers: false,
                            uri: `sip:${connectOptions.username}@${connectOptions.domain}`,
                            password: connectOptions.password,
                        }

                        if (opensipsConfiguration.noiseReductionOptions) {
                            configuration.noiseReductionOptions = {
                                ...opensipsConfiguration.noiseReductionOptions,
                                vadModule: VAD
                            } as NoiseReductionOptions
                        } else {
                            configuration.noiseReductionOptions = {
                                mode: 'disabled',
                                vadModule: VAD
                            } as NoiseReductionOptions
                        }

                        if (connectOptions.authorization_jwt) {
                            configuration.authorization_jwt = connectOptions.authorization_jwt
                        }

                        const additionalOptions: Partial<IOpenSIPSJSOptions> = {}

                        if (connectOptions.msrpDomain) {
                            additionalOptions.msrpDomain = connectOptions.msrpDomain
                        }

                        if (connectOptions.msrpWs) {
                            additionalOptions.msrpWs = connectOptions.msrpWs
                        }

                        openSIPSJS = new OpenSIPSJS({
                            configuration,
                            socketInterfaces: [ `wss://${connectOptions.domain}` ],
                            sipDomain: `${connectOptions.domain}`,
                            sipOptions: {
                                session_timers: false,
                                extraHeaders: [ 'X-Bar: bar' ],
                                pcConfig: {},
                            },
                            modules: connectOptions.modules,
                            pnExtraHeaders,
                            ...additionalOptions
                        }, logger)

                        /* ---------- Audio / call listeners ---------- */
                        openSIPSJS
                            .on('connection', (value) => {
                                addCallToCurrentRoom.value = false
                                isInitialized.value = true
                                isOpenSIPSReady.value = value

                                resolve(openSIPSJS as OpenSIPSJS)
                            })
                            .on('reconnecting', (value) => {
                                isOpenSIPSReconnecting.value = value
                            })
                            .on('changeActiveCalls', (sessions) => {
                                allCalls.value = { ...sessions }
                            })
                            .on('changeActiveMessages', (sessions) => {
                                activeMessages.value = { ...sessions as { [key: string]: IMessage } }
                            })
                            .on('callAddingInProgressChanged', (value) => {
                                callAddingInProgress.value = value
                            })
                            .on('changeAvailableDeviceList', (devices) => {
                                availableMediaDevices.value = [ ...devices ]
                            })
                            .on('changeActiveInputMediaDevice', (data) => {
                                selectedInputDevice.value = data
                            })
                            .on('changeActiveOutputMediaDevice', (data) => {
                                selectedOutputDevice.value = data
                            })
                            .on('changeMuteWhenJoin', (value) => {
                                muteWhenJoin.value = value
                            })
                            .on('changeIsCallWaiting', (value) => {
                                isCallWaitingEnabled.value = value
                            })
                            .on('changeIsDND', (value) => {
                                isDND.value = value
                            })
                            .on('changeIsMuted', (value) => {
                                isMuted.value = value
                            })
                            .on('changeActiveStream', (value) => {
                                originalStream.value = value
                            })
                            .on('currentActiveRoomChanged', (id) => {
                                currentActiveRoomId.value = id
                            })
                            .on('addRoom', ({ roomList }) => {
                                allRooms.value = { ...roomList }
                            })
                            .on('updateRoom', ({ roomList }) => {
                                allRooms.value = { ...roomList }
                            })
                            .on('removeRoom', ({ roomList }) => {
                                allRooms.value = { ...roomList }
                            })
                            .on('changeCallStatus', (data) => {
                                callStatus.value = { ...data }
                            })
                            .on('changeCallTime', (data) => {
                                callTime.value = { ...data }
                            })
                            .on('changeCallMetrics', (data) => {
                                callMetrics.value = { ...data }
                            })
                            .on('changeNoiseReductionState', (state) => {
                                noiseReductionState.value = state
                            })
                            /* ---------- MSRP listeners ---------- */
                            // Cast: the bundled opensips-js types have a duplicated
                            // MSRPSessionEventMap (a known artifact of the dts bundler),
                            // which makes the IMessage from src/types/msrp.d.ts and the
                            // one referenced by changeMsrpSessionListener resolve as
                            // distinct types even though they describe the same shape.
                            .on('changeMsrpSession', ((session: IMessage | null) => {
                                currentMsrpSession.value = session
                            }) as any)
                            .on('isMSRPInitializingChanged', ((value: boolean) => {
                                isMSRPInitializing.value = value
                            }) as any)
                            .on('msrpSyncCompleted', (payload) => {
                                conversations.value = { ...payload.conversations }
                                messagesByConversation.value = { ...(payload.messagesByConversation ?? {}) }

                                const nextUnread: UnreadCounts = {}
                                for (const k of Object.keys(unreadByConversation.value)) {
                                    if (payload.conversations[k]) nextUnread[k] = unreadByConversation.value[k]
                                }
                                unreadByConversation.value = nextUnread
                            })
                            .on('msrpConversationCreated', (payload) => {
                                conversations.value = {
                                    ...conversations.value,
                                    [payload.conversationKey]: payload.conversation
                                }
                                if (!messagesByConversation.value[payload.conversationKey]) {
                                    messagesByConversation.value = {
                                        ...messagesByConversation.value,
                                        [payload.conversationKey]: []
                                    }
                                }
                            })
                            .on('msrpConversationRemoved', (payload) => {
                                if (payload.conversationKey in conversations.value) {
                                    const next = { ...conversations.value }
                                    delete next[payload.conversationKey]
                                    conversations.value = next
                                }
                                if (payload.conversationKey in messagesByConversation.value) {
                                    const nextMsgs = { ...messagesByConversation.value }
                                    delete nextMsgs[payload.conversationKey]
                                    messagesByConversation.value = nextMsgs
                                }
                                if (unreadByConversation.value[payload.conversationKey]) {
                                    const u = { ...unreadByConversation.value }
                                    delete u[payload.conversationKey]
                                    unreadByConversation.value = u
                                }
                            })
                            .on('msrpConversationUpdated', (payload) => {
                                const c = conversations.value[payload.conversationKey]
                                if (!c) return
                                Object.assign(c, payload.patch)
                            })
                            .on('msrpMessageAdded', (payload) => {
                                const c = conversations.value[payload.conversationKey]
                                if (!c) return
                                // Ensure the bucket exists - the message may arrive
                                // before a sync.
                                if (!messagesByConversation.value[payload.conversationKey]) {
                                    messagesByConversation.value[payload.conversationKey] = []
                                }
                                messagesByConversation.value[payload.conversationKey].push(payload.message)
                                c.updated_at = payload.message.origin_server_ts || Date.now()

                                if (payload.conversationKey === currentConversationKey.value) return
                                const myUri = getViewerUri()
                                if (payload.message?.sender && payload.message.sender === myUri) return
                                unreadByConversation.value = {
                                    ...unreadByConversation.value,
                                    [payload.conversationKey]:
                                        (unreadByConversation.value[payload.conversationKey] || 0) + 1
                                }
                            })
                            .on('msrpReceiptChanged', (payload) => {
                                const messages = messagesByConversation.value[payload.conversationKey]
                                if (messages) {
                                    const m = findMessage(messages, payload.eventId)
                                    if (m?.content) m.content.status = payload.status
                                }
                                const c = conversations.value[payload.conversationKey]
                                if (c) c.updated_at = payload.updatedAt
                            })
                            .on('msrpReactionChanged', (payload) => {
                                const messages = messagesByConversation.value[payload.conversationKey]
                                if (messages) {
                                    const m = findMessage(messages, payload.eventId)
                                    applyReaction(m, payload.emoji, payload.action, payload.sender, getViewerUri())
                                    if (m?.content) m.content.updated_at = payload.updatedAt
                                }
                                const c = conversations.value[payload.conversationKey]
                                if (c) c.updated_at = payload.updatedAt
                            })
                            .on('msrpTyping', (payload) => {
                                if (payload.isTyping) {
                                    typingByConversation.value = {
                                        ...typingByConversation.value,
                                        [payload.conversationKey]: {
                                            sender: payload.sender,
                                            isTyping: true,
                                            updatedAt: Date.now()
                                        }
                                    }
                                } else {
                                    const next = { ...typingByConversation.value }
                                    delete next[payload.conversationKey]
                                    typingByConversation.value = next
                                }
                            })
                            .begin()

                        resolve(openSIPSJS)
                    } catch (e) {
                        console.error(e)

                        reject()
                    }
                }
            )
        },
        unregister () {
            openSIPSJS?.unregister()
        },
        register () {
            openSIPSJS?.register()
        },
        disconnect () {
            openSIPSJS?.disconnect()
        },
        initCall (target: string, addToCurrentRoom = false, holdOtherCalls = false) {
            openSIPSJS?.audio.initCall(target, addToCurrentRoom, holdOtherCalls)
        },
        answerCall (callId: string) {
            openSIPSJS?.audio.answerCall(callId)
        },
        terminateCall (callId: string) {
            openSIPSJS?.audio.terminateCall(callId)
        },
        mute () {
            openSIPSJS?.audio.mute()
        },
        unmute () {
            openSIPSJS?.audio.unmute()
        },
        transferCall (callId: string, target: string) {
            openSIPSJS?.audio.transferCall(callId, target)
        },
        mergeCall (roomId: number) {
            openSIPSJS?.audio.mergeCall(roomId)
        },
        mergeCallByIds (firstCallId: string, secondCallId: string) {
            openSIPSJS?.audio.mergeCallByIds(firstCallId, secondCallId)
        },
        holdCall (callId: string, automatic?: boolean) {
            openSIPSJS?.audio.holdCall(callId, automatic)
        },
        unholdCall (callId: string) {
            openSIPSJS?.audio.unholdCall(callId)
        },
        async moveCall (callId: string, roomId: number) {
            await openSIPSJS?.audio.moveCall(callId, roomId)
        },
        muteCaller (callId: string) {
            openSIPSJS?.audio.muteCaller(callId)
        },
        unmuteCaller (callId: string) {
            openSIPSJS?.audio.unmuteCaller(callId)
        },
        setMuteWhenJoin (state: boolean) {
            openSIPSJS?.audio.setMuteWhenJoin(state)
        },
        setDND (state: boolean) {
            openSIPSJS?.audio.setDND(state)
        },
        setCallWaiting (state: boolean) {
            openSIPSJS?.audio.setCallWaiting(state)
        },
        async setMicrophone (deviceId: string) {
            await openSIPSJS?.audio.setMicrophone(deviceId)
        },
        async setSpeaker (deviceId: string) {
            await openSIPSJS?.audio.setSpeaker(deviceId)
        },
        sendDTMF (callId: string, value: string) {
            openSIPSJS?.audio.sendDTMF(callId, value)
        },
        async setActiveRoom (roomId: number | undefined) {
            await openSIPSJS?.audio.setActiveRoom(roomId)
        },
        setMicrophoneSensitivity (value: number) {
            microphoneInputLevel.value = value
            openSIPSJS?.audio.setMicrophoneSensitivity(value)
        },
        setSpeakerVolume (value: number) {
            speakerVolume.value = value
            openSIPSJS?.audio.setSpeakerVolume(value)
        },
        setAutoAnswer (value: boolean) {
            autoAnswer.value = value
            openSIPSJS?.audio.setAutoAnswer(value)
        },
        setMetricsConfig (config: WebrtcMetricsConfigType) {
            openSIPSJS?.audio.setMetricsConfig(config)
        },
        setVADConfiguration (config: Partial<NoiseReductionOptionsWithoutVadModule>) {
            openSIPSJS?.audio.setVADConfiguration(config)
        },
        getNoiseReductionMode () {
            return openSIPSJS?.audio.getNoiseReductionMode()
        },
        /* ---------- MSRP actions ---------- */
        initMSRP (options: object = {}) {
            openSIPSJS?.msrp.initMSRP(options)
        },
        initMSRPAndSendMessage (target: string, body: string, options: object = {}) {
            openSIPSJS?.msrp.initMSRPAndSendMessage(target, body, options)
        },
        msrpAnswer (callId: string) {
            openSIPSJS?.msrp.msrpAnswer(callId)
        },
        messageTerminate (callId: string) {
            openSIPSJS?.msrp.messageTerminate(callId)
        },
        sendMSRP (msrpSessionId: string, body: string) {
            openSIPSJS?.msrp.sendMSRP(msrpSessionId, body)
        },
        safeSendMSRP (body: string) {
            return openSIPSJS?.msrp.safeSendMSRP(body) ?? false
        },
        sendCreateConversationMessage (targetSip: string | string[]) {
            return openSIPSJS?.msrp.sendCreateConversationMessage(targetSip) ?? false
        },
        sendTextMessage (conversationKey: string, text: string) {
            return openSIPSJS?.msrp.sendTextMessage(conversationKey, text) ?? false
        },
        sendMediaMessage (conversationKey: string, uploadResult: MSRPUploadResult, caption = '') {
            return openSIPSJS?.msrp.sendMediaMessage(conversationKey, uploadResult, caption) ?? false
        },
        sendReaction (conversationKey: string, targetEventId: string, emoji: string) {
            return openSIPSJS?.msrp.sendReaction(conversationKey, targetEventId, emoji) ?? false
        },
        sendTypingIndicator (conversationKey: string, isTyping: boolean) {
            return openSIPSJS?.msrp.sendTypingIndicator(conversationKey, isTyping) ?? false
        },
        startTypingKeepAlive (conversationKey: string) {
            openSIPSJS?.msrp.startTypingKeepAlive(conversationKey)
        },
        stopTypingKeepAlive (sendStop = true) {
            openSIPSJS?.msrp.stopTypingKeepAlive(sendStop)
        },
        sendReadReceipt (conversationKey: string) {
            const lastEventId = resolveLastEventId(conversationKey)
            if (!lastEventId) return false
            return openSIPSJS?.msrp.sendReadReceipt(conversationKey, lastEventId) ?? false
        },
        closeConversation (conversationKey: string, reason?: string, cause?: string) {
            return openSIPSJS?.msrp.closeConversation(conversationKey, reason, cause) ?? false
        },
        changeMemberRole (conversationKey: string, targetUri: string, newRole: MSRPMemberRole) {
            return openSIPSJS?.msrp.changeMemberRole(conversationKey, targetUri, newRole) ?? false
        },
        acceptInvite (conversationKey: string) {
            return openSIPSJS?.msrp.acceptInvite(conversationKey) ?? false
        },
        rejectInvite (conversationKey: string) {
            return openSIPSJS?.msrp.rejectInvite(conversationKey) ?? false
        },
        leaveConversation (conversationKey: string) {
            return openSIPSJS?.msrp.leaveConversation(conversationKey) ?? false
        },
        setActiveConversation (conversationKey: string | null) {
            if (currentConversationKey.value === conversationKey) return
            currentConversationKey.value = conversationKey
            if (conversationKey) {
                const lastEventId = resolveLastEventId(conversationKey)
                if (lastEventId) {
                    openSIPSJS?.msrp.sendReadReceipt(conversationKey, lastEventId)
                }
                if (unreadByConversation.value[conversationKey]) {
                    const next = { ...unreadByConversation.value }
                    delete next[conversationKey]
                    unreadByConversation.value = next
                }
            }
        },
        requestUploadUrl (conversationKey: string, filename: string, mimeType: string, fileSize: number) {
            if (!openSIPSJS) return Promise.reject(new Error('OpenSIPSJS not initialized'))
            return openSIPSJS.msrp.requestUploadUrl(conversationKey, filename, mimeType, fileSize)
        },
        requestFileAccess (conversationKey: string, eventId: string) {
            if (!openSIPSJS) return Promise.reject(new Error('OpenSIPSJS not initialized'))
            return openSIPSJS.msrp.requestFileAccess(conversationKey, eventId)
        },
        uploadFile (conversationKey: string, file: File, caption = '') {
            if (!openSIPSJS) return Promise.reject(new Error('OpenSIPSJS not initialized'))
            return openSIPSJS.msrp.uploadFile(conversationKey, file, caption)
        }
    }
}
