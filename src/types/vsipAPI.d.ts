import type { Ref } from 'vue'
import { ICall, ICallStatus, IMessage, IRoom, ITimeData, MSRPMessage } from '@voicenter-team/opensips-js'

export interface VsipAPI {
    state: VsipAPIState
    actions: VsipAPIActions
}

export interface VsipAPIState {
    activeCalls: Ref<{ [key: string]: ICall }>
    activeMessages: Ref<{ [key: string]: IMessage }>
    addCallToCurrentRoom: Ref<boolean>
    callAddingInProgress: Ref<string | undefined>
    activeRooms: Ref<{ [key: number]: IRoom }>
    msrpHistory: Ref<{ [key: string]: Array<MSRPMessage> }>
    availableMediaDevices: Ref<Array<MediaDeviceInfo>>
    selectedOutputDevice: Ref<string>
    selectedInputDevice: Ref<string>
    muteWhenJoin: Ref<boolean>
    isDND: Ref<boolean>
    isMuted: Ref<boolean>
    originalStream: Ref<MediaStream | null>
    currentActiveRoomId: Ref<number | undefined>
    autoAnswer: Ref<boolean>
    microphoneInputLevel: Ref<number>
    speakerVolume: Ref<number>
    callStatus: Ref<{ [key: string]: ICallStatus }>
    callTime: Ref<{ [key: string]: ITimeData }>
    callMetrics: Ref<{ [key: string]: unknown }>
}

export interface VsipAPIActions {
    init(domain: string, username: string, password: string): void
    muteCaller: (callId: string, state: boolean) => void
    doMute: (state: boolean) => void
    callTerminate: (callId: string) => void
    callTransfer: (callId: string, target: string) => void
    callMerge: (roomId: number) => void
    doCallHold: (params: DoCallHoldParamsType) => void
    callAnswer: (callId: string) => void
    callMove: (callId: string, roomId: number) => Promise<void>
    msrpAnswer: (callId: string) => void
    messageTerminate: (callId: string) => void
    doCall: (target: string, addToCurrentRoom = false) => void
    sendMSRP: (msrpSessionId: string, body: string) => void
    initMSRP: (target: string, body: string, options: object) => void
    setMicrophone: (deviceId: string) => Promise<void>
    setSpeaker: (deviceId: string) => Promise<void>
    sendDTMF: (callId: string, value: string) => void
    setCurrentActiveRoomId: (roomId: number | undefined) => Promise<void>
    setMicrophoneInputLevel: (value: number) => void
    setSpeakerVolume: (value: number) => void
    setAutoAnswer: (value: boolean) => void
}

export interface DoCallHoldParamsType {
    callId: string
    toHold: boolean
    automatic?: boolean
}
