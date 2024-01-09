import { ref } from 'vue'
import OpenSIPSJS from '@voicenter-team/opensips-js'
import { ITimeData } from '@voicenter-team/opensips-js/src/types/timer'
//import { RTCSessionEvent } from 'jssip/lib/UA'
import { ICall, IRoom, ICallStatus } from '@voicenter-team/opensips-js/src/types/rtc'
import { IMessage, MSRPMessage } from '@voicenter-team/opensips-js/src/types/msrp'

import { VsipAPI, DoCallHoldParamsType } from '@/types'

const activeCalls = ref<{ [key: string]: ICall }>({})
const activeMessages = ref<{ [key: string]: IMessage }>({})
const openSIPSJS = ref<OpenSIPSJS | undefined>(undefined)
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
const speakerVolume = ref<number>(2) // [0;1]
const callStatus = ref<{ [key: string]: ICallStatus }>({})
const callTime = ref<{ [key: string]: ITimeData }>({})
const callMetrics = ref<{ [key: string]: unknown }>({})

export const vsipAPI: VsipAPI = {
    state: {
        activeCalls: activeCalls,
        activeMessages: activeMessages,
        addCallToCurrentRoom: addCallToCurrentRoom,
        callAddingInProgress: callAddingInProgress,
        activeRooms: activeRooms,
        msrpHistory: msrpHistory,
        availableMediaDevices: availableMediaDevices,
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
        microphoneInputLevel: microphoneInputLevel,
        speakerVolume: speakerVolume,
    },
    actions: {
        init (domain, username, password) {
            try {
                openSIPSJS.value = new OpenSIPSJS({
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
                openSIPSJS.value
                    .on('ready', () => {
                        addCallToCurrentRoom.value = false
                    })
                    .on('changeActiveCalls', (sessions) => {
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
            openSIPSJS.value?.doMute(state)
        },
        muteCaller (callId: string, state: boolean) {
            openSIPSJS.value?.muteCaller(callId, state)
        },
        callTerminate (callId: string) {
            openSIPSJS.value?.callTerminate(callId)
        },
        callTransfer (callId: string, target: string) {
            openSIPSJS.value?.callTransfer(callId, target)
        },
        callMerge (roomId: number) {
            openSIPSJS.value?.callMerge(roomId)
        },
        doCallHold ({ callId, toHold, automatic }: DoCallHoldParamsType) {
            const parameters: DoCallHoldParamsType = {
                callId,
                toHold
            }

            if (automatic !== undefined) {
                parameters.automatic = automatic
            }

            openSIPSJS.value?.doCallHold(parameters)
        },
        callAnswer (callId: string) {
            openSIPSJS.value?.callAnswer(callId)
        },
        async callMove (callId: string, roomId: number) {
            await openSIPSJS.value?.callMove(callId, roomId)
        },
        msrpAnswer (callId: string) {
            openSIPSJS.value?.msrpAnswer(callId)
        },
        messageTerminate (callId: string) {
            openSIPSJS.value?.messageTerminate(callId)
        },
        doCall (target: string, addToCurrentRoom = false) {
            openSIPSJS.value?.doCall({
                target,
                addToCurrentRoom
            })
        },
        sendMSRP (msrpSessionId: string, body: string) {
            openSIPSJS.value?.sendMSRP(msrpSessionId, body)
        },
        initMSRP (target: string, body: string, options: object) {
            openSIPSJS.value?.initMSRP(target, body, options)
        },
        async setMicrophone (deviceId: string) {
            await openSIPSJS.value?.setMicrophone(deviceId)
        },
        async setSpeaker (deviceId: string) {
            await openSIPSJS.value?.setSpeaker(deviceId)
        },
        sendDTMF (callId: string, value: string) {
            openSIPSJS.value?.sendDTMF(callId, value)
        },
        async setCurrentActiveRoomId (roomId: number | undefined) {
            await openSIPSJS.value?.setCurrentActiveRoomId(roomId)
        },
        setMicrophoneInputLevel (value: number) {
            microphoneInputLevel.value = value
            openSIPSJS.value?.setMicrophoneInputLevel(value)
        },
        setSpeakerVolume (value: number) {
            speakerVolume.value = value
            openSIPSJS.value?.setSpeakerVolume(value)
        },
        setAutoAnswer (value: boolean) {
            autoAnswer.value = value
            openSIPSJS.value?.setAutoAnswer(value)
        },
    }
}
