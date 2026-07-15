import { computed, ref, watch } from 'vue'
import OpenSIPSJS from 'opensips-js'
import type {
    ITimeData,
    IOpenSIPSJSOptions,
    ICall,
    IRoom,
    ICallStatus,
    CustomLoggerType,
    IOpenSIPSConfiguration,
    NoiseReductionOptions,
    NoiseReductionOptionsWithoutVadModule,
    IMessage,
    WebrtcMetricsConfigType
} from 'opensips-js'
import * as VAD from '@ricky0123/vad-web'

import { VsipAPI } from '@/types'
import {
    MSRP_EVT,
    MSRPConversationRef,
    MSRPConversationState,
    MSRPMemberRole,
    MSRPPresenceState,
    MSRPReactionAction,
    MSRPSendMessageOptions,
    MSRPTypingState,
    MSRPUploadResult,
    UnreadCounts
} from '@/types/msrp'

let openSIPSJS: OpenSIPSJS | undefined = undefined
let currentUserUri = ''

/* ---------- Audio / call state ---------- */
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
const isCallWaitingEnabled = ref<boolean>(true)
const isMuted = ref<boolean>(false)
const originalStream = ref<MediaStream | null>(null)
const currentActiveRoomId = ref<number | undefined>(undefined)
const autoAnswer = ref<boolean>(false)
const microphoneInputLevel = ref<number>(2)
const speakerVolume = ref<number>(1)
const callStatus = ref<{ [key: string]: ICallStatus }>({})
const callTime = ref<{ [key: string]: ITimeData }>({})
const callMetrics = ref<{ [key: string]: unknown }>({})
const noiseReductionState = ref<boolean>(false)

/* ---------- MSRP session state ---------- */
const currentMsrpSession = ref<IMessage | null>(null)
const isMSRPInitializing = ref<boolean>(false)

/* ---------- MSRP conversation state ----------
 * Conversation metadata and chat history are kept as two parallel maps.
 * Metadata is small and changes rarely; messages are fat and churn on every
 * new event - keeping them separate prevents message activity from
 * invalidating metadata-only views. Both maps are keyed by the public
 * numeric `conversation_id` (stringified for use as an object key).
 */
const conversations = ref<{ [conversationId: string]: MSRPConversationState }>({})
const messagesByConversation = ref<{ [conversationId: string]: any[] }>({})
const typingByConversation = ref<{ [conversationId: string]: MSRPTypingState }>({})
const presenceBySender = ref<{ [sender: string]: MSRPPresenceState }>({})

/* ---------- UI-only MSRP state ---------- */
const currentConversationId = ref<string | null>(null)

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

/* ---------- MSRP local helpers ---------- */
function idKey (id: number | null | undefined): string | null {
    return id === undefined || id === null ? null : String(id)
}

function findMessage (messages: any[], eventId: string) {
    return messages.find((msg: any) => msg.event_id === eventId)
}

function onlyRealMessages (list: any[] | undefined) {
    if (!list?.length) return [] as any[]
    return list.filter((e: any) => e?.type === MSRP_EVT.MESSAGE)
}

function findLastIndexByEventId (list: any[], eventId: string): number {
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i]?.event_id === eventId) return i
    }
    return -1
}

/**
 * Merge two timelines de-duplicating by `event_id` and sorted
 * chronologically. Used when a `msrpSyncCompleted` payload arrives after
 * some live messages were already pushed into the conversation bucket.
 */
function mergeMessagesByEventId (existing: any[], incoming: any[]): any[] {
    const byId = new Map<string, any>()
    const orphans: any[] = []
    const consume = (msg: any) => {
        const id = msg?.event_id
        if (typeof id === 'string' && id) {
            byId.set(id, msg)
        } else {
            orphans.push(msg)
        }
    }
    for (const msg of existing) consume(msg)
    for (const msg of incoming) consume(msg)
    return [ ...byId.values(), ...orphans ].sort(
        (a, b) => (a?.origin_server_ts || 0) - (b?.origin_server_ts || 0)
    )
}

function computeUnreadCount (
    messages: any[] | undefined,
    lastReadMessageId: string | null | undefined
): number {
    const real = onlyRealMessages(messages)
    if (!real.length) return 0
    if (lastReadMessageId === null) return real.length
    if (lastReadMessageId === undefined) return 0
    const idx = findLastIndexByEventId(real, lastReadMessageId)
    if (idx === -1) return real.length
    return real.length - idx - 1
}

function computeFirstUnreadEventId (
    messages: any[] | undefined,
    lastReadMessageId: string | null | undefined
): string | null {
    const real = onlyRealMessages(messages)
    if (!real.length) return null
    if (lastReadMessageId === null) return real[0]?.event_id ?? null
    if (lastReadMessageId === undefined) return null
    const idx = findLastIndexByEventId(real, lastReadMessageId)
    if (idx === -1) return real[0]?.event_id ?? null
    return real[idx + 1]?.event_id ?? null
}

/**
 * Apply a live `m.reaction` event to the target message's
 * `reactions_summary` array, mirroring the exact shape the backend
 * returns on sync (`{ emoji, count, user_ids, viewer_reacted }`).
 * Invariant enforced: `count === user_ids.length`. `viewer_reacted` is
 * recomputed from `user_ids` so we never depend on a possibly-wrong
 * server value.
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

function resolveLastEventId (conversationId: string): string | null {
    const messages = messagesByConversation.value[conversationId]
    if (!messages?.length) return null
    const lastMsg = [ ...messages ]
        .filter((m: any) => m.type === MSRP_EVT.MESSAGE && m.event_id)
        .sort((a: any, b: any) => (a.origin_server_ts || 0) - (b.origin_server_ts || 0))
        .pop()
    return lastMsg?.event_id ?? null
}

/* ---------- Receiver-side typing indicator expiry ----------
 * The SDK is a pure heartbeat: senders publish `typing=true` while composing
 * and never send an explicit stop. The composable expires stale indicators
 * locally after `INCOMING_TYPING_EXPIRY_MS` of silence and also clears them
 * eagerly when a message from that same sender arrives.
 */
const INCOMING_TYPING_EXPIRY_MS = 5000
const incomingTypingTimers = new Map<string, ReturnType<typeof setTimeout>>()

function typingTimerKey (cid: string, sender: string): string {
    return `${cid}:${sender}`
}

function clearTypingIndicator (cid: string, sender: string): void {
    const key = typingTimerKey(cid, sender)
    const existing = incomingTypingTimers.get(key)
    if (existing) {
        clearTimeout(existing)
        incomingTypingTimers.delete(key)
    }
    const current = typingByConversation.value[cid]
    if (current?.sender !== sender) return
    const next = { ...typingByConversation.value }
    delete next[cid]
    typingByConversation.value = next
}

function restartTypingTimeout (cid: string, sender: string): void {
    const key = typingTimerKey(cid, sender)
    const existing = incomingTypingTimers.get(key)
    if (existing) clearTimeout(existing)
    incomingTypingTimers.set(
        key,
        setTimeout(() => clearTypingIndicator(cid, sender), INCOMING_TYPING_EXPIRY_MS)
    )
}

function clearAllTypingTimersForConversation (cid: string): void {
    const prefix = `${cid}:`
    for (const key of incomingTypingTimers.keys()) {
        if (key.startsWith(prefix)) {
            clearTimeout(incomingTypingTimers.get(key)!)
            incomingTypingTimers.delete(key)
        }
    }
}

function clearAllTypingTimers (): void {
    incomingTypingTimers.forEach((handle) => clearTimeout(handle))
    incomingTypingTimers.clear()
}

/* ---------- Auto-read + optimistic pointer ----------
 * When the user is looking at a conversation and it has new messages, we
 * auto-fire `m.read` for the latest event_id and optimistically bump the
 * local `currentUserLastReadMessageId` so the UI reflects "read" without
 * waiting for the backend to echo an `m.sync`. The suppress set lets
 * explicit "mark as unread" actions win until the user switches
 * conversations.
 */
let lastRequestedReadEventIdByConv: Record<string, string> = {}
const autoReadExclusions = new Set<string>()

watch(currentConversationId, (_newId, oldId) => {
    if (oldId) autoReadExclusions.delete(oldId)
})

function applyOptimisticPointer (cid: string, pointerValue: string | null): void {
    const conv = conversations.value[cid]
    if (!conv) return
    if (conv.currentUserLastReadMessageId === pointerValue) return
    conv.currentUserLastReadMessageId = pointerValue
}

function beginUnreadOverride (cid: string): void {
    autoReadExclusions.add(cid)
    delete lastRequestedReadEventIdByConv[cid]
}

/* ---------- MSRP computed views ---------- */
const hasActiveMsrpSession = computed(() => currentMsrpSession.value !== null)

const currentConversation = computed<MSRPConversationState | null>(() => {
    const id = currentConversationId.value
    if (!id) return null
    return conversations.value[id] ?? null
})

const currentMessages = computed<any[]>(() => {
    const id = currentConversationId.value
    if (!id) return []
    return messagesByConversation.value[id] ?? []
})

const sortedConversations = computed<MSRPConversationState[]>(() => {
    return Object.values(conversations.value).sort(
        (a, b) => (b.updated_at || 0) - (a.updated_at || 0)
    )
})

const unreadByConversation = computed<UnreadCounts>(() => {
    const result: UnreadCounts = {}
    for (const [ cid, conv ] of Object.entries(conversations.value)) {
        const count = computeUnreadCount(
            messagesByConversation.value[cid],
            conv?.currentUserLastReadMessageId
        )
        if (count > 0) result[cid] = count
    }
    return result
})

const firstUnreadByConversation = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {}
    for (const [ cid, conv ] of Object.entries(conversations.value)) {
        const eventId = computeFirstUnreadEventId(
            messagesByConversation.value[cid],
            conv?.currentUserLastReadMessageId
        )
        if (eventId) result[cid] = eventId
    }
    return result
})

watch(
    () => {
        const cid = currentConversationId.value
        if (!cid) return null
        if (autoReadExclusions.has(cid)) return null
        const conv = conversations.value[cid]
        if (!conv) return null
        const latestEventId = resolveLastEventId(cid)
        if (!latestEventId) return null
        return {
            cid,
            pointer: conv.currentUserLastReadMessageId,
            latestEventId
        }
    },
    (payload) => {
        if (!openSIPSJS || !payload) return
        const { cid, pointer, latestEventId } = payload
        if (pointer === latestEventId) return
        if (lastRequestedReadEventIdByConv[cid] === latestEventId) return
        lastRequestedReadEventIdByConv[cid] = latestEventId
        const ok = openSIPSJS.msrp.sendReadReceipt(cid as any, latestEventId)
        if (ok) applyOptimisticPointer(cid, latestEventId)
    },
    { immediate: true }
)

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
        currentConversationId,
        currentConversation,
        currentMessages,
        sortedConversations,
        typingByConversation,
        presenceBySender,
        unreadByConversation,
        firstUnreadByConversation
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

                        currentUserUri = `sip:${connectOptions.username}@${connectOptions.domain}`

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
                            .on('changeMsrpSession', ((session: IMessage | null) => {
                                currentMsrpSession.value = session
                                if (!session) {
                                    clearAllTypingTimers()
                                    typingByConversation.value = {}
                                    presenceBySender.value = {}
                                }
                            }) as any)
                            .on('isMSRPInitializingChanged', ((value: boolean) => {
                                isMSRPInitializing.value = value
                            }) as any)
                            .on('msrpSyncCompleted', ((payload: any) => {
                                conversations.value = { ...payload.conversations }
                                const nextMessages = { ...messagesByConversation.value }
                                const incoming = payload.messagesByConversation ?? {}
                                for (const [ cid, historicalList ] of Object.entries(incoming)) {
                                    nextMessages[cid] = mergeMessagesByEventId(
                                        nextMessages[cid] ?? [],
                                        historicalList as any[]
                                    )
                                }
                                messagesByConversation.value = nextMessages
                            }) as any)
                            .on('msrpConversationCreated', ((payload: any) => {
                                const cid = idKey(payload.conversation?.conversation_id)
                                if (!cid) return
                                conversations.value = {
                                    ...conversations.value,
                                    [cid]: payload.conversation
                                }
                                if (!messagesByConversation.value[cid]) {
                                    messagesByConversation.value = {
                                        ...messagesByConversation.value,
                                        [cid]: []
                                    }
                                }
                            }) as any)
                            .on('msrpConversationRemoved', ((payload: any) => {
                                const cid = idKey(payload.conversation_id)
                                if (!cid) return
                                if (cid in conversations.value) {
                                    const next = { ...conversations.value }
                                    delete next[cid]
                                    conversations.value = next
                                }
                                if (cid in messagesByConversation.value) {
                                    const nextMsgs = { ...messagesByConversation.value }
                                    delete nextMsgs[cid]
                                    messagesByConversation.value = nextMsgs
                                }
                                if (cid in lastRequestedReadEventIdByConv) {
                                    const next = { ...lastRequestedReadEventIdByConv }
                                    delete next[cid]
                                    lastRequestedReadEventIdByConv = next
                                }
                                clearAllTypingTimersForConversation(cid)
                                if (cid in typingByConversation.value) {
                                    const nextTyping = { ...typingByConversation.value }
                                    delete nextTyping[cid]
                                    typingByConversation.value = nextTyping
                                }
                            }) as any)
                            .on('msrpConversationUpdated', ((payload: any) => {
                                const cid = idKey(payload.conversation_id)
                                if (!cid) return
                                const c = conversations.value[cid]
                                if (!c) return
                                Object.assign(c, payload.patch)
                            }) as any)
                            .on('msrpMessageAdded', ((payload: any) => {
                                const cid = idKey(payload.conversation_id)
                                if (!cid) return
                                const c = conversations.value[cid]
                                if (!c) return
                                if (!messagesByConversation.value[cid]) {
                                    messagesByConversation.value[cid] = []
                                }
                                const list = messagesByConversation.value[cid]
                                const incomingEventId = payload.message?.event_id
                                if (incomingEventId) {
                                    const existingIdx = list.findIndex(
                                        (m: any) => m?.event_id === incomingEventId
                                    )
                                    if (existingIdx !== -1) {
                                        list.splice(existingIdx, 1, {
                                            ...list[existingIdx],
                                            ...payload.message,
                                            content: {
                                                ...(list[existingIdx]?.content ?? {}),
                                                ...(payload.message?.content ?? {})
                                            }
                                        })
                                        c.updated_at = payload.message.origin_server_ts || Date.now()
                                        return
                                    }
                                }
                                list.push(payload.message)
                                c.updated_at = payload.message.origin_server_ts || Date.now()
                                const senderUri = payload.message?.sender
                                if (senderUri) clearTypingIndicator(cid, senderUri)
                            }) as any)
                            .on('msrpReceiptChanged', ((payload: any) => {
                                const cid = idKey(payload.conversation_id)
                                if (!cid) return
                                const messages = messagesByConversation.value[cid]
                                if (messages) {
                                    const m = findMessage(messages, payload.eventId)
                                    if (m?.content) m.content.status = payload.status
                                }
                                const c = conversations.value[cid]
                                if (c) c.updated_at = payload.updatedAt
                            }) as any)
                            .on('msrpReactionChanged', ((payload: any) => {
                                const cid = idKey(payload.conversation_id)
                                if (!cid) return
                                const messages = messagesByConversation.value[cid]
                                if (messages) {
                                    const m = findMessage(messages, payload.eventId)
                                    applyReaction(m, payload.emoji, payload.action, payload.sender, currentUserUri)
                                    if (m?.content) m.content.updated_at = payload.updatedAt
                                }
                                const c = conversations.value[cid]
                                if (c) c.updated_at = payload.updatedAt
                            }) as any)
                            .on('msrpMessageEdited', ((payload: any) => {
                                const cid = idKey(payload.conversation_id)
                                if (!cid) return
                                const messages = messagesByConversation.value[cid]
                                if (messages) {
                                    const m = findMessage(messages, payload.eventId)
                                    if (m?.content) {
                                        const newText = payload.newContent?.content
                                        if (typeof newText === 'string') m.content.content = newText
                                        m.content.edited_at = payload.updatedAt
                                        m.unsigned = m.unsigned || {}
                                        m.unsigned['m.relations'] = {
                                            'm.replace': {
                                                event_id: payload.editEvent?.event_id,
                                                sender: payload.editEvent?.sender,
                                                origin_server_ts: payload.updatedAt,
                                                content: payload.newContent
                                            }
                                        }
                                    }
                                }
                                const c = conversations.value[cid]
                                if (c) c.updated_at = payload.updatedAt
                            }) as any)
                            .on('msrpMessageDeleted', ((payload: any) => {
                                const cid = idKey(payload.conversation_id)
                                if (!cid) return
                                const messages = messagesByConversation.value[cid]
                                if (messages) {
                                    const m = findMessage(messages, payload.eventId)
                                    if (m?.content) {
                                        m.content.is_deleted = true
                                        m.content.deleted_at = payload.updatedAt
                                        m.content.deleted_by = payload.deletedBy
                                    }
                                }
                                const c = conversations.value[cid]
                                if (c) c.updated_at = payload.updatedAt
                            }) as any)
                            .on('msrpTyping', ((payload: { conversation_id?: number, sender: string, isTyping: boolean }) => {
                                const cid = idKey(payload.conversation_id)
                                if (!cid || !payload.sender) return
                                if (payload.isTyping) {
                                    typingByConversation.value = {
                                        ...typingByConversation.value,
                                        [cid]: {
                                            sender: payload.sender,
                                            isTyping: true,
                                            updatedAt: Date.now()
                                        }
                                    }
                                    restartTypingTimeout(cid, payload.sender)
                                } else {
                                    clearTypingIndicator(cid, payload.sender)
                                }
                            }) as any)
                            .on('msrpPresence', ((payload: any) => {
                                if (!payload?.sender) return
                                presenceBySender.value = {
                                    ...presenceBySender.value,
                                    [payload.sender]: {
                                        presence: payload.presence,
                                        lastActiveAt: payload.lastActiveAt,
                                        updatedAt: payload.updatedAt
                                    }
                                }
                            }) as any)
                            .begin()

                        resolve(openSIPSJS)
                    } catch (e) {
                        console.error(e)

                        reject(e)
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
        sendTextMessage (
            conversationRef: MSRPConversationRef,
            text: string,
            options: MSRPSendMessageOptions = {}
        ) {
            return openSIPSJS?.msrp.sendTextMessage(conversationRef, text, options) ?? false
        },
        sendInternalNote (
            conversationRef: MSRPConversationRef,
            text: string,
            options: Omit<MSRPSendMessageOptions, 'messageType'> = {}
        ) {
            return (openSIPSJS?.msrp as any)?.sendInternalNote(conversationRef, text, options) ?? false
        },
        editMessage (conversationRef: MSRPConversationRef, targetEventId: string, newText: string) {
            return (openSIPSJS?.msrp as any)?.editMessage(conversationRef, targetEventId, newText) ?? false
        },
        deleteMessage (conversationRef: MSRPConversationRef, targetEventId: string) {
            return (openSIPSJS?.msrp as any)?.deleteMessage(conversationRef, targetEventId) ?? false
        },
        forwardMessage (
            sourceMessage: any,
            targetConversationRef: MSRPConversationRef,
            forwardedFromLabel?: string
        ) {
            return (openSIPSJS?.msrp as any)?.forwardMessage(
                sourceMessage,
                targetConversationRef,
                forwardedFromLabel
            ) ?? false
        },
        sendMediaMessage (
            conversationRef: MSRPConversationRef,
            uploadResult: MSRPUploadResult,
            caption = ''
        ) {
            return openSIPSJS?.msrp.sendMediaMessage(conversationRef, uploadResult, caption) ?? false
        },
        sendReaction (
            conversationRef: MSRPConversationRef,
            targetEventId: string,
            emoji: string,
            action: MSRPReactionAction = 'add'
        ) {
            return openSIPSJS?.msrp.sendReaction(conversationRef, targetEventId, emoji, action) ?? false
        },
        removeReaction (conversationRef: MSRPConversationRef, targetEventId: string, emoji: string) {
            return (openSIPSJS?.msrp as any)?.removeReaction(conversationRef, targetEventId, emoji) ?? false
        },
        sendTypingIndicator (conversationRef: MSRPConversationRef) {
            return openSIPSJS?.msrp.sendTypingIndicator(conversationRef) ?? false
        },
        startTypingKeepAlive (conversationRef: MSRPConversationRef) {
            openSIPSJS?.msrp.startTypingKeepAlive(conversationRef)
        },
        stopTypingKeepAlive () {
            openSIPSJS?.msrp.stopTypingKeepAlive()
        },
        markConversationAsUnread (conversationRef: MSRPConversationRef) {
            const cid = idKey(Number(conversationRef))
            if (cid) beginUnreadOverride(cid)
            const ok = (openSIPSJS?.msrp as any)?.markAsUnread(conversationRef, null) ?? false
            if (ok && cid) applyOptimisticPointer(cid, null)
            return ok
        },
        markAsUnreadFromMessage (
            conversationRef: MSRPConversationRef,
            targetEventId: string
        ) {
            const cid = idKey(Number(conversationRef))
            if (!cid || !targetEventId) return false
            const real = onlyRealMessages(messagesByConversation.value[cid])
            if (!real.length) return false
            const idx = findLastIndexByEventId(real, targetEventId)
            if (idx === -1) return false
            const prevEventId = idx > 0 ? real[idx - 1].event_id : null
            beginUnreadOverride(cid)
            const ok = (openSIPSJS?.msrp as any)?.markAsUnread(conversationRef, prevEventId) ?? false
            if (ok) applyOptimisticPointer(cid, prevEventId)
            return ok
        },
        closeConversation (conversationRef: MSRPConversationRef, reason?: string, cause?: string) {
            return openSIPSJS?.msrp.closeConversation(conversationRef, reason, cause) ?? false
        },
        changeMemberRole (conversationRef: MSRPConversationRef, targetUri: string, newRole: MSRPMemberRole) {
            return openSIPSJS?.msrp.changeMemberRole(conversationRef, targetUri, newRole) ?? false
        },
        acceptInvite (conversationRef: MSRPConversationRef) {
            return openSIPSJS?.msrp.acceptInvite(conversationRef) ?? false
        },
        rejectInvite (conversationRef: MSRPConversationRef) {
            return openSIPSJS?.msrp.rejectInvite(conversationRef) ?? false
        },
        leaveConversation (conversationRef: MSRPConversationRef) {
            return openSIPSJS?.msrp.leaveConversation(conversationRef) ?? false
        },
        setActiveConversation (conversationId: string | null) {
            if (currentConversationId.value === conversationId) return
            currentConversationId.value = conversationId
        },
        requestUploadUrl (conversationRef: MSRPConversationRef, filename: string, mimeType: string, fileSize: number) {
            if (!openSIPSJS) return Promise.reject(new Error('OpenSIPSJS not initialized'))
            return openSIPSJS.msrp.requestUploadUrl(conversationRef, filename, mimeType, fileSize)
        },
        requestFileAccess (conversationRef: MSRPConversationRef, eventId: string) {
            if (!openSIPSJS) return Promise.reject(new Error('OpenSIPSJS not initialized'))
            return openSIPSJS.msrp.requestFileAccess(conversationRef, eventId)
        },
        uploadFile (conversationRef: MSRPConversationRef, file: File, caption = '') {
            if (!openSIPSJS) return Promise.reject(new Error('OpenSIPSJS not initialized'))
            return openSIPSJS.msrp.uploadFile(conversationRef, file, caption)
        }
    }
}
