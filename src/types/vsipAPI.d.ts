import type { Ref, ComputedRef } from 'vue'
import { ICallStatus, ICall, IRoom } from '@voicenter-team/opensips-js/src/types/rtc'
import { ITimeData } from '@voicenter-team/opensips-js/src/types/timer'
import { MSRPMessage, IMessage } from '@voicenter-team/opensips-js/src/types/msrp'
import OpenSIPSJS from '@voicenter-team/opensips-js'

export interface VsipAPI {
    state: VsipAPIState
    actions: VsipAPIActions
}

export type MediaDeviceOption = Omit<MediaDeviceInfo, 'toJSON'>

export interface VsipAPIState {
    isInitialized: Ref<boolean>
    activeCalls: Ref<{ [key: string]: ICall }>
    callsInActiveRoom: ComputedRef<Array<ICall>>
    activeMessages: Ref<{ [key: string]: IMessage }>
    addCallToCurrentRoom: Ref<boolean>
    callAddingInProgress: Ref<string | undefined>
    activeRooms: Ref<{ [key: number]: IRoom }>
    msrpHistory: Ref<{ [key: string]: Array<MSRPMessage> }>
    availableMediaDevices: Ref<Array<MediaDeviceInfo>>
    inputMediaDeviceList: Ref<Array<MediaDeviceOption>>
    outputMediaDeviceList: Ref<Array<MediaDeviceOption>>
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

interface PNExtraHeaders {
    [key: string]: string
}

export interface VsipAPIActions {
    init(domain: string, username: string, password: string, pnExtraHeaders?: PNExtraHeaders): Promise<unknown>
    unregister: () => void
    register: () => void
    disconnect: () => void
    muteCaller: (callId: string) => void
    unmuteCaller: (callId: string) => void
    mute: () => void
    unmute: () => void
    setMuteWhenJoin: (state: boolean) => void
    setDND: (state: boolean) => void
    terminateCall: (callId: string) => void
    transferCall: (callId: string, target: string) => void
    mergeCall: (roomId: number) => void
    mergeCallByIds: (firstCallId: string, secondCallId: string) => void
    holdCall: (callId: string, automatic?: boolean) => void
    unholdCall: (callId: string) => void
    answerCall: (callId: string) => void
    moveCall: (callId: string, roomId: number) => Promise<void>
    msrpAnswer: (callId: string) => void
    messageTerminate: (callId: string) => void
    initCall: (target: string, addToCurrentRoom: boolean) => void
    sendMSRP: (msrpSessionId: string, body: string) => void
    initMSRP: (target: string, body: string, options: object) => void
    setMicrophone: (deviceId: string) => Promise<void>
    setSpeaker: (deviceId: string) => Promise<void>
    sendDTMF: (callId: string, value: string) => void
    setActiveRoom: (roomId: number | undefined) => Promise<void>
    setMicrophoneSensitivity: (value: number) => void
    setSpeakerVolume: (value: number) => void
    setAutoAnswer: (value: boolean) => void
}
