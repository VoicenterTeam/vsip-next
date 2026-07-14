import type { Ref, ComputedRef } from 'vue'
import type {
    ICallStatus,
    ICall,
    IRoom,
    IOpenSIPSConfiguration,
    NoiseReductionOptions,
    NoiseReductionOptionsWithoutVadModule,
    NoiseReductionMode,
    CustomLoggerType,
    ITimeData,
    IMessage,
    WebrtcMetricsConfigType
} from 'opensips-js'

import type {
    MSRPConversationState,
    MSRPMemberRole,
    MSRPUploadResult,
    MSRPConversationRef,
    MSRPReactionAction,
    MSRPSendMessageOptions,
    MSRPTypingState,
    MSRPPresenceState,
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
    // Conversations are keyed by their public numeric `conversation_id`
    // stringified. Metadata and chat history are kept as two parallel maps
    // so that message activity doesn't invalidate metadata-only consumers.
    conversations: Ref<{ [conversationId: string]: MSRPConversationState }>
    messagesByConversation: Ref<{ [conversationId: string]: any[] }>
    currentConversationId: Ref<string | null>
    currentConversation: ComputedRef<MSRPConversationState | null>
    currentMessages: ComputedRef<any[]>
    sortedConversations: ComputedRef<MSRPConversationState[]>
    typingByConversation: Ref<{ [conversationId: string]: MSRPTypingState }>
    presenceBySender: Ref<{ [sender: string]: MSRPPresenceState }>
    /**
     * Per-conversation unread count derived from
     * `MSRPConversationState.currentUserLastReadMessageId` + local timeline.
     * Only conversations with count > 0 appear in the map.
     */
    unreadByConversation: ComputedRef<UnreadCounts>
    /**
     * event_id of the first unread message per conversation. Consumers use
     * this to place a "— New messages —" divider inside the open chat.
     */
    firstUnreadByConversation: ComputedRef<Record<string, string>>
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
    sendTextMessage: (
        conversationRef: MSRPConversationRef,
        text: string,
        options?: MSRPSendMessageOptions
    ) => boolean
    sendInternalNote: (
        conversationRef: MSRPConversationRef,
        text: string,
        options?: Omit<MSRPSendMessageOptions, 'messageType'>
    ) => boolean
    editMessage: (conversationRef: MSRPConversationRef, targetEventId: string, newText: string) => boolean
    deleteMessage: (conversationRef: MSRPConversationRef, targetEventId: string) => boolean
    forwardMessage: (
        sourceMessage: any,
        targetConversationRef: MSRPConversationRef,
        forwardedFromLabel?: string
    ) => boolean
    sendMediaMessage: (
        conversationRef: MSRPConversationRef,
        uploadResult: MSRPUploadResult,
        caption?: string
    ) => boolean
    sendReaction: (
        conversationRef: MSRPConversationRef,
        targetEventId: string,
        emoji: string,
        action?: MSRPReactionAction
    ) => boolean
    removeReaction: (conversationRef: MSRPConversationRef, targetEventId: string, emoji: string) => boolean
    sendTypingIndicator: (conversationRef: MSRPConversationRef) => boolean
    startTypingKeepAlive: (conversationRef: MSRPConversationRef) => void
    stopTypingKeepAlive: () => void
    /**
     * Mark the whole conversation as unread (server-side pointer → null).
     * Optimistically applies the pointer locally so the UI reflects the
     * change without waiting for a backend echo.
     */
    markConversationAsUnread: (conversationRef: MSRPConversationRef) => boolean
    /**
     * Mark `targetEventId` and every later message as unread. The pointer
     * is moved to the message immediately preceding `targetEventId` in the
     * local timeline; if the target is the very first message the pointer
     * becomes null (whole conversation unread).
     */
    markAsUnreadFromMessage: (
        conversationRef: MSRPConversationRef,
        targetEventId: string
    ) => boolean
    closeConversation: (conversationRef: MSRPConversationRef, reason?: string, cause?: string) => boolean
    changeMemberRole: (conversationRef: MSRPConversationRef, targetUri: string, newRole: MSRPMemberRole) => boolean
    acceptInvite: (conversationRef: MSRPConversationRef) => boolean
    rejectInvite: (conversationRef: MSRPConversationRef) => boolean
    leaveConversation: (conversationRef: MSRPConversationRef) => boolean
    setActiveConversation: (conversationId: string | null) => void
    requestUploadUrl: (
        conversationRef: MSRPConversationRef,
        filename: string,
        mimeType: string,
        fileSize: number
    ) => Promise<MSRPUploadResult>
    requestFileAccess: (conversationRef: MSRPConversationRef, eventId: string) => Promise<unknown>
    uploadFile: (conversationRef: MSRPConversationRef, file: File, caption?: string) => Promise<MSRPUploadResult>
}
