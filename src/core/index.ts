import { computed, ref, watch } from 'vue'
import OpenSIPSJS from '@voicenter-team/opensips-js'
import { ITimeData } from '@voicenter-team/opensips-js/src/types/timer'
import { ICall, IRoom, ICallStatus } from '@voicenter-team/opensips-js/src/types/rtc'
import { IMessage, MSRPMessage } from '@voicenter-team/opensips-js/src/types/msrp'

import { VsipAPI, DoCallHoldParamsType } from '@/types'

let openSIPSJS: OpenSIPSJS | undefined = undefined //ref<OpenSIPSJS | undefined>(undefined)

const isInitialized = ref<boolean>(false)
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

watch(microphoneInputLevel, (newValue) => {
    vsipAPI.actions.setMicrophoneInputLevel(newValue)
})

watch(speakerVolume, (newValue) => {
    vsipAPI.actions.setSpeakerVolume(newValue)
})

watch(currentActiveRoomId, async (newValue) => {
    await vsipAPI.actions.setCurrentActiveRoomId(newValue)
})


export const vsipAPI: VsipAPI = {
    state: {
        isInitialized: isInitialized,
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
        init (domain, username, password) {
            try {
                openSIPSJS = new OpenSIPSJS({
                    configuration: {
                        session_timers: false,
                        uri: `sip:${username}@${domain}`,
                        password: password
                    },
                    socketInterfaces: [ `wss://${domain}` ],
                    sipDomain: `${domain}`,
                    sipOptions: {
                        session_timers: false,
                        extraHeaders: [ 'X-Bar: bar' ],
                        pcConfig: {},
                    },
                })

                /* openSIPSJS Listeners */
                openSIPSJS
                    .on('ready', () => {
                        addCallToCurrentRoom.value = false
                        isInitialized.value = true
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
                    .on('changeIsDND', (value) => {
                        isDND.value = value
                    })
                    .on('changeIsMuted', (value) => {
                        isMuted.value = value
                    })
                    .on('changeOriginalStream', (value) => {
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
            } catch (e) {
                console.error(e)
            }
        },
        doMute (state: boolean) {
            openSIPSJS?.doMute(state)
        },
        setMuteWhenJoin (state: boolean) {
            openSIPSJS?.setMuteWhenJoin(state)
        },
        muteCaller (callId: string, state: boolean) {
            openSIPSJS?.muteCaller(callId, state)
        },
        setDND (state: boolean) {
            openSIPSJS?.setDND(state)
        },
        callTerminate (callId: string) {
            openSIPSJS?.callTerminate(callId)
        },
        callTransfer (callId: string, target: string) {
            openSIPSJS?.callTransfer(callId, target)
        },
        callMerge (roomId: number) {
            openSIPSJS?.callMerge(roomId)
        },
        doCallHold ({ callId, toHold, automatic }: DoCallHoldParamsType) {
            const parameters: DoCallHoldParamsType = {
                callId,
                toHold
            }

            if (automatic !== undefined) {
                parameters.automatic = automatic
            }

            openSIPSJS?.doCallHold(parameters)
        },
        callAnswer (callId: string) {
            openSIPSJS?.callAnswer(callId)
        },
        async callMove (callId: string, roomId: number) {
            await openSIPSJS?.callMove(callId, roomId)
        },
        msrpAnswer (callId: string) {
            openSIPSJS?.msrpAnswer(callId)
        },
        messageTerminate (callId: string) {
            openSIPSJS?.messageTerminate(callId)
        },
        doCall (target: string, addToCurrentRoom = false) {
            openSIPSJS?.doCall({
                target,
                addToCurrentRoom
            })
        },
        sendMSRP (msrpSessionId: string, body: string) {
            openSIPSJS?.sendMSRP(msrpSessionId, body)
        },
        initMSRP (target: string, body: string, options: object) {
            openSIPSJS?.initMSRP(target, body, options)
        },
        async setMicrophone (deviceId: string) {
            await openSIPSJS?.setMicrophone(deviceId)
        },
        async setSpeaker (deviceId: string) {
            await openSIPSJS?.setSpeaker(deviceId)
        },
        sendDTMF (callId: string, value: string) {
            openSIPSJS?.sendDTMF(callId, value)
        },
        async setCurrentActiveRoomId (roomId: number | undefined) {
            await openSIPSJS?.setCurrentActiveRoomId(roomId)
        },
        setMicrophoneInputLevel (value: number) {
            microphoneInputLevel.value = value
            openSIPSJS?.setMicrophoneInputLevel(value)
        },
        setSpeakerVolume (value: number) {
            speakerVolume.value = value
            openSIPSJS?.setSpeakerVolume(value)
        },
        setAutoAnswer (value: boolean) {
            autoAnswer.value = value
            openSIPSJS?.setAutoAnswer(value)
        },
    }
}
