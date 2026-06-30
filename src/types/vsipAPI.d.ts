import type { Ref, ComputedRef } from 'vue'
import {
    ICallStatus,
    ICall,
    IRoom,
    IOpenSIPSConfiguration,
    NoiseReductionOptions,
    NoiseReductionOptionsWithoutVadModule,
    NoiseReductionMode,
    CustomLoggerType
} from 'opensips-js/src/types/rtc'
import { ITimeData } from 'opensips-js/src/types/timer'
import { IMessage } from 'opensips-js/src/types/msrp'
import { WebrtcMetricsConfigType } from 'opensips-js/src/types/webrtcmetrics'

import {
    MSRPConversationState,
    MSRPMemberRole,
    MSRPUploadResult,
    MSRPTypingState,
    UnreadCounts
} from './msrp'

export interface VsipAPI {
    state: VsipAPIState
    actions: VsipAPIActions
}

export interface OpensipsConnectOptions {
    domain: string
    username: string
    modules: Array<'audio' | 'video' | 'msrp'>
    password?: string
    authorization_jwt?: string
    msrpDomain?: string
    msrpWs?: boolean
}

export type MediaDeviceOption = Omit<MediaDeviceInfo, 'toJSON'>

export interface VsipAPIState {
    isInitialized: Ref<boolean>
    isOpenSIPSReady: Ref<boolean>
    isOpenSIPSReconnecting: Ref<boolean>
    activeCalls: Ref<{ [key: string]: ICall }>
    callsInActiveRoom: ComputedRef<Array<ICall>>
    activeMessages: Ref<{ [key: string]: IMessage }>
    addCallToCurrentRoom: Ref<boolean>
    callAddingInProgress: Ref<string | undefined>
    activeRooms: Ref<{ [key: number]: IRoom }>
    availableMediaDevices: Ref<Array<MediaDeviceInfo>>
    inputMediaDeviceList: Ref<Array<MediaDeviceOption>>
    outputMediaDeviceList: Ref<Array<MediaDeviceOption>>
    selectedOutputDevice: Ref<string>
    selectedInputDevice: Ref<string>
    muteWhenJoin: Ref<boolean>
    isDND: Ref<boolean>
    isCallWaitingEnabled: Ref<boolean>
    isMuted: Ref<boolean>
    originalStream: Ref<MediaStream | null>
    currentActiveRoomId: Ref<number | undefined>
    autoAnswer: Ref<boolean>
    microphoneInputLevel: Ref<number>
    speakerVolume: Ref<number>
    callStatus: Ref<{ [key: string]: ICallStatus }>
    callTime: Ref<{ [key: string]: ITimeData }>
    callMetrics: Ref<{ [key: string]: unknown }>
    noiseReductionState: Ref<boolean>
    // ---------- MSRP session ----------
    currentMsrpSession: Ref<IMessage | null>
    isMSRPInitializing: Ref<boolean>
    hasActiveMsrpSession: ComputedRef<boolean>
    // ---------- MSRP conversation state ----------
    // Metadata and chat history are kept as two parallel maps so that
    // message activity doesn't invalidate metadata-only consumers.
    conversations: Ref<{ [conversationKey: string]: MSRPConversationState }>
    messagesByConversation: Ref<{ [conversationKey: string]: any[] }>
    currentConversationKey: Ref<string | null>
    currentConversation: ComputedRef<MSRPConversationState | null>
    currentMessages: ComputedRef<any[]>
    sortedConversations: ComputedRef<MSRPConversationState[]>
    typingByConversation: Ref<{ [conversationKey: string]: MSRPTypingState }>
    unreadByConversation: Ref<UnreadCounts>
}

interface PNExtraHeaders {
    [key: string]: string
}

export type InitOpensipsConfiguration = Omit<IOpenSIPSConfiguration, 'uri' | 'session_timers' | 'password' | 'noiseReductionOptions'> & {
    noiseReductionOptions?: NoiseReductionOptionsWithoutVadModule
}

export interface VsipAPIActions {
    init(credentials: OpensipsConnectOptions, pnExtraHeaders?: PNExtraHeaders, opensipsConfiguration?: Partial<InitOpensipsConfiguration>, logger?: CustomLoggerType): Promise<unknown>
    unregister: () => void
    register: () => void
    disconnect: () => void
    muteCaller: (callId: string) => void
    unmuteCaller: (callId: string) => void
    mute: () => void
    unmute: () => void
    setMuteWhenJoin: (state: boolean) => void
    setDND: (state: boolean) => void
    setCallWaiting: (state: boolean) => void
    setVADConfiguration: (config: Partial<NoiseReductionOptionsWithoutVadModule>) => void
    getNoiseReductionMode: () => NoiseReductionMode | undefined
    terminateCall: (callId: string) => void
    transferCall: (callId: string, target: string) => void
    mergeCall: (roomId: number) => void
    mergeCallByIds: (firstCallId: string, secondCallId: string) => void
    holdCall: (callId: string, automatic?: boolean) => void
    unholdCall: (callId: string) => void
    answerCall: (callId: string) => void
    moveCall: (callId: string, roomId: number) => Promise<void>
    initCall: (target: string, addToCurrentRoom: boolean, holdOtherCalls?: boolean) => void
    setMicrophone: (deviceId: string) => Promise<void>
    setSpeaker: (deviceId: string) => Promise<void>
    sendDTMF: (callId: string, value: string) => void
    setActiveRoom: (roomId: number | undefined) => Promise<void>
    setMicrophoneSensitivity: (value: number) => void
    setSpeakerVolume: (value: number) => void
    setAutoAnswer: (value: boolean) => void
    setMetricsConfig: (config: WebrtcMetricsConfigType) => void
    // ---------- MSRP ----------
    initMSRP: (options?: object) => void
    initMSRPAndSendMessage: (target: string, body: string, options?: object) => void
    msrpAnswer: (callId: string) => void
    messageTerminate: (callId: string) => void
    sendMSRP: (msrpSessionId: string, body: string) => void
    safeSendMSRP: (body: string) => boolean
    sendCreateConversationMessage: (targetSip: string | string[]) => boolean
    sendTextMessage: (conversationKey: string, text: string) => boolean
    sendMediaMessage: (conversationKey: string, uploadResult: MSRPUploadResult, caption?: string) => boolean
    sendReaction: (conversationKey: string, targetEventId: string, emoji: string) => boolean
    sendTypingIndicator: (conversationKey: string, isTyping: boolean) => boolean
    startTypingKeepAlive: (conversationKey: string) => void
    stopTypingKeepAlive: (sendStop?: boolean) => void
    sendReadReceipt: (conversationKey: string) => boolean
    closeConversation: (conversationKey: string, reason?: string, cause?: string) => boolean
    changeMemberRole: (conversationKey: string, targetUri: string, newRole: MSRPMemberRole) => boolean
    acceptInvite: (conversationKey: string) => boolean
    rejectInvite: (conversationKey: string) => boolean
    leaveConversation: (conversationKey: string) => boolean
    setActiveConversation: (conversationKey: string | null) => void
    requestUploadUrl: (conversationKey: string, filename: string, mimeType: string, fileSize: number) => Promise<MSRPUploadResult>
    requestFileAccess: (conversationKey: string, eventId: string) => Promise<unknown>
    uploadFile: (conversationKey: string, file: File, caption?: string) => Promise<MSRPUploadResult>
}
