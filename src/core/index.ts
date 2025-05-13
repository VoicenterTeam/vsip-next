import { computed, ref, watch } from 'vue'
import OpenSIPSJS from '@voicenter-team/opensips-js'
import { ITimeData } from '@voicenter-team/opensips-js/src/types/timer'
import { ICall, IRoom, ICallStatus } from '@voicenter-team/opensips-js/src/types/rtc'
import { IMessage, MSRPMessage } from '@voicenter-team/opensips-js/src/types/msrp'

import { VsipAPI } from '@/types'

let openSIPSJS: OpenSIPSJS | undefined = undefined

const isInitialized = ref<boolean>(false)
const isOpenSIPSReady = ref<boolean>(false)
const isOpenSIPSReconnecting = ref<boolean>(false)
const activeCalls = ref<{ [key: string]: ICall }>({})
const activeMessages = ref<{ [key: string]: IMessage }>({})
const addCallToCurrentRoom = ref<boolean>(false)
const callAddingInProgress = ref<string | undefined>(undefined)
const activeRooms = ref<{ [key: number]: IRoom }>({})
const msrpHistory = ref<{ [key: string]: Array<MSRPMessage> }>({})
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

watch(selectedInputDevice, async (newValue) => {
    await vsipAPI.actions.setMicrophone(newValue)
})

watch(selectedOutputDevice, async (newValue) => {
    await vsipAPI.actions.setSpeaker(newValue)
})

watch(muteWhenJoin, (newValue) => {
    vsipAPI.actions.setMuteWhenJoin(newValue)
})

watch(isDND, (newValue) => {
    vsipAPI.actions.setDND(newValue)
})

watch(isCallWaitingEnabled, (newValue) => {
    vsipAPI.actions.setCallWaiting(newValue)
})

watch(microphoneInputLevel, (newValue) => {
    vsipAPI.actions.setMicrophoneSensitivity(newValue)
})

watch(speakerVolume, (newValue) => {
    vsipAPI.actions.setSpeakerVolume(newValue)
})

watch(currentActiveRoomId, async (newValue) => {
    await vsipAPI.actions.setActiveRoom(newValue)
})

export const vsipAPI: VsipAPI = {
    state: {
        isInitialized: isInitialized,
        isOpenSIPSReady: isOpenSIPSReady,
        isOpenSIPSReconnecting: isOpenSIPSReconnecting,
        activeCalls: activeCalls,
        callsInActiveRoom,
        activeMessages: activeMessages,
        addCallToCurrentRoom: addCallToCurrentRoom,
        callAddingInProgress: callAddingInProgress,
        activeRooms: activeRooms,
        msrpHistory: msrpHistory,
        availableMediaDevices: availableMediaDevices,
        inputMediaDeviceList,
        outputMediaDeviceList,
        selectedOutputDevice: selectedOutputDevice,
        selectedInputDevice: selectedInputDevice,
        muteWhenJoin: muteWhenJoin,
        isDND: isDND,
        isCallWaitingEnabled: isCallWaitingEnabled,
        isMuted: isMuted,
        originalStream: originalStream,
        currentActiveRoomId: currentActiveRoomId,
        callStatus: callStatus,
        callTime: callTime,
        callMetrics: callMetrics,
        autoAnswer: autoAnswer,
        microphoneInputLevel,
        speakerVolume: speakerVolume,
    },
    actions: {
        init (domain, username, password, pnExtraHeaders, opensipsConfiguration = {}) {
            return new Promise(
                (resolve, reject) => {
                    try {
                        openSIPSJS = new OpenSIPSJS({
                            configuration: {
                                ...opensipsConfiguration,
                                session_timers: false,
                                uri: `sip:${username}@${domain}`,
                                password: password,
                            },
                            socketInterfaces: [ `wss://${domain}` ],
                            sipDomain: `${domain}`,
                            sipOptions: {
                                session_timers: false,
                                extraHeaders: [ 'X-Bar: bar' ],
                                pcConfig: {},
                            },
                            modules: [ 'audio' ],
                            pnExtraHeaders
                        })

                        /* openSIPSJS Listeners */
                        openSIPSJS
                            .on('connection', (value) => {
                                addCallToCurrentRoom.value = false
                                isInitialized.value = true
                                isOpenSIPSReady.value = value

                                resolve(openSIPSJS)
                            })
                            .on('reconnecting', (value) => {
                                isOpenSIPSReconnecting.value = value
                            })
                            .on('changeActiveCalls', (sessions) => {
                                console.log('changeActiveCalls', sessions)
                                activeCalls.value = { ...sessions }
                            })
                            .on('changeActiveMessages', (sessions) => {
                                activeMessages.value = { ...sessions as { [key: string]: IMessage } }
                            })
                            .on('newMSRPMessage', (data) => {
                                const sessionId = data.session._id
                                const sessionMessages = msrpHistory.value[sessionId] || []
                                sessionMessages.push(data.message)
                                msrpHistory.value[sessionId] = [ ...sessionMessages ]
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
                                activeRooms.value = { ...roomList }
                            })
                            .on('updateRoom', ({ roomList }) => {
                                activeRooms.value = { ...roomList }
                            })
                            .on('removeRoom', ({ roomList }) => {
                                activeRooms.value = { ...roomList }
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
        initCall (target: string, addToCurrentRoom = false,  holdOtherCalls = false) {
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
        msrpAnswer (callId: string) {
            openSIPSJS?.msrp.msrpAnswer(callId)
        },
        messageTerminate (callId: string) {
            openSIPSJS?.msrp.messageTerminate(callId)
        },
        sendMSRP (msrpSessionId: string, body: string) {
            openSIPSJS?.msrp.sendMSRP(msrpSessionId, body)
        },
        initMSRP (target: string, body: string, options: object) {
            openSIPSJS?.msrp.initMSRP(target, body, options)
        }
    }
}
