import { apiClient, apiGet, buildApiUrl } from './client'
import type {
    ConversationListParams,
    ConversationListResponse,
    ConversationSearchResponse,
    ExportFormat,
    MembersResponse,
    MessagesListParams,
    MessagesListResponse,
    MessagesSearchResponse
} from './types'

function encodeId (id: string | number): string {
    return encodeURIComponent(String(id))
}

export function listConversations (
    params?: ConversationListParams
): Promise<ConversationListResponse> {
    return apiGet<ConversationListResponse>('/conversations', { params })
}

export function listMessages (
    conversationId: string | number,
    params?: MessagesListParams
): Promise<MessagesListResponse> {
    return apiGet<MessagesListResponse>(
        `/conversations/${encodeId(conversationId)}/messages`,
        { params }
    )
}

export function searchMessagesInConversation (
    conversationId: string | number,
    query: string,
    params?: { limit?: number, cursor?: string }
): Promise<MessagesSearchResponse> {
    return apiGet<MessagesSearchResponse>(
        `/conversations/${encodeId(conversationId)}/messages/search`,
        { params: { q: query, ...(params ?? {}) } }
    )
}

export function listConversationMembers (
    conversationId: string | number
): Promise<MembersResponse> {
    return apiGet<MembersResponse>(
        `/conversations/${encodeId(conversationId)}/members`
    )
}

/**
 * Fetch the raw export payload. Returns a Blob so the caller can hand it
 * straight to `URL.createObjectURL()` and trigger a download-as-file link.
 */
export async function exportConversation (
    conversationId: string | number,
    format: ExportFormat = 'txt'
): Promise<Blob> {
    const { data } = await apiClient.get<Blob>(
        `/conversations/${encodeId(conversationId)}/export`,
        {
            params: { format },
            responseType: 'blob'
        }
    )
    return data
}

export function getConversationExportUrl (
    conversationId: string | number,
    format: ExportFormat = 'txt'
): string {
    return buildApiUrl(
        `/conversations/${encodeId(conversationId)}/export`,
        { format }
    )
}

export function searchConversations (
    query: string,
    params?: { limit?: number, cursor?: string }
): Promise<ConversationSearchResponse> {
    return apiGet<ConversationSearchResponse>(
        '/conversations/search',
        { params: { q: query, ...(params ?? {}) } }
    )
}
