/**
 * MSRP types local to the vsip-next Vue wrapper.
 *
 * Runtime shape types produced by `opensips-js` (conversation state, uploads,
 * membership, message status, `MSRP_EVT`, etc.) are consumed directly from
 * the package's public entry. Only wrapper-local shapes (UI-only state that
 * never appears on the wire) live here.
 */

export {
    MSRP_EVT
} from 'opensips-js'

export type {
    MSRPMemberRole,
    MSRPMembership,
    MSRPMessageStatus,
    MSRPConversationState,
    MSRPUploadResult,
    MSRPConversationRef,
    MSRPReactionAction,
    MSRPSendMessageOptions
} from 'opensips-js'

/**
 * Transient typing indicator kept per-conversation. Not emitted by
 * opensips-js; the wrapper composes it from `msrpTyping` events plus a
 * `Date.now()` timestamp for UI decay.
 */
export interface MSRPTypingState {
    sender: string
    isTyping: boolean
    updatedAt: number
}

/**
 * Presence pulse for a peer, indexed by SIP URI. Values are pushed from
 * `msrpPresence` events and consumed by presence dots / "last seen" UI.
 */
export interface MSRPPresenceState {
    presence: string | null
    lastActiveAt: number | null
    updatedAt: number
}

/**
 * Per-conversation unread count derived from
 * `MSRPConversationState.currentUserLastReadMessageId` + local timeline.
 * Only conversations with count > 0 appear in the map.
 */
export type UnreadCounts = Record<string, number>
