/**
 * Local mirror of the MSRP module types from `opensips-js/src/modules/msrp`.
 *
 * The published `opensips-js` package only ships `dist/` + `src/types/`, so
 * the module-level types are not importable from the consumer. We declare a
 * faithful subset here so the Vue wrapper can stay strictly typed without a
 * runtime dependency on the module source.
 *
 * Keep this file in sync with `opensips-js/src/modules/msrp.ts`.
 */

export type MSRPMemberRole = 'in_charge' | 'manager' | 'assigned'
export type MSRPMembership = 'join' | 'leave' | 'invite' | 'ban'
export type MSRPMessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface MSRPConversationState {
    conversationKey: string
    creator: string | null
    members: Set<string>
    memberRoles: Map<string, MSRPMemberRole>
    currentUserRole: MSRPMemberRole
    currentUserStatus: MSRPMembership | null
    state_events: { [key: string]: { [stateKey: string]: any } }
    created_at: number
    updated_at: number
    status?: string
}

export interface MSRPUploadResult {
    upload_url: string
    expires_in?: number
    mime_type: string
    request_id: string
    filename?: string
    preview_url?: string
    icon_url?: string
    transcription?: string
    media_type?: string
}

export interface MSRPTypingState {
    sender: string
    isTyping: boolean
    updatedAt: number
}

export type UnreadCounts = { [conversationKey: string]: number }

// The few MSRP_EVT entries the wrapper itself reads. Keep in lockstep with
// the canonical `MSRP_EVT` constant in opensips-js.
export const MSRP_EVT = {
    MESSAGE: 'm.conversation.message'
} as const
