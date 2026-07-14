import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

import { vsipAPI } from '@/core'

import { VsipAPI } from '@/types'

const key = Symbol() as InjectionKey<VsipAPI>

export function useVsipProvide () {
    provide(
        key,
        vsipAPI
    )

    return vsipAPI
}

export function useVsipInject () {
    const vsipAPI = inject(key)

    if (!vsipAPI) {
        throw new Error('useVsipInject() is called without provider, please call useVsipProvide() first')
    }

    return vsipAPI
}

export { vsipAPI } from '@/core'
export type { VsipAPI } from '@/types'
export type { OpensipsConnectOptions } from '@/types'

/* Re-export the public API surface from opensips-js's main entry (not
 * its internal `src/types/*` subpaths - those files use `@/*` aliases
 * that misresolve against vsip-next's own `@` alias when rolled up by
 * api-extractor). Names are listed explicitly so the surface is
 * intentional rather than "whatever opensips-js happens to export".
 */

// Runtime constants
export { MSRP_EVT } from 'opensips-js'

export type {
    // Call / RTC shapes
    ICall,
    IRoom,
    ICallStatus,
    IOpenSIPSConfiguration,
    IOpenSIPSJSOptions,
    NoiseReductionOptions,
    NoiseReductionOptionsWithoutVadModule,
    NoiseReductionMode,
    CustomLoggerType,
    // Call-timer payload
    ITimeData,
    // Event map + payload helpers. Individual `*Listener` aliases are
    // intentionally omitted - each is reconstructible on demand as
    // `OpenSIPSEventMap['<eventName>']`.
    OpenSIPSEventMap,
    ListenerCallbackFnType,
    MSRPMessageEventType,
    ChangeVolumeEventType,
    ConnectionStateChangeType,
    // MSRP session / conversation shapes
    IMessage,
    MSRPSessionExtended,
    TriggerMSRPListenerOptions,
    ListenerEventType,
    MSRPMemberRole,
    MSRPMembership,
    MSRPMessageStatus,
    MSRPConversationState,
    MSRPUploadResult,
    MSRPConversationRef,
    MSRPReactionAction,
    MSRPSendMessageOptions,
    // WebRTC metrics config
    WebrtcMetricsConfigType
} from 'opensips-js'

/* Wrapper-local MSRP shapes (typing decay, presence pulse, unread map). */
export type {
    MSRPTypingState,
    MSRPPresenceState,
    UnreadCounts
} from '@/types/msrp'
