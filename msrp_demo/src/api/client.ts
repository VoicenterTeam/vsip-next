import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig } from 'axios'

export const API_BASE_URL = 'https://wbi.voicenter.co/api/v1'
export const API_ORIGIN = 'https://wbi.voicenter.co'

let apiToken: string | null = null

export function setApiToken (token: string | null | undefined): void {
    apiToken = token ? token.trim() : null
}

export function getApiToken (): string | null {
    return apiToken
}

export function hasApiToken (): boolean {
    return !!apiToken
}

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000
})

apiClient.interceptors.request.use((config) => {
    if (apiToken) {
        const headers = AxiosHeaders.from(config.headers)
        headers.set('Authorization', `Bearer ${apiToken}`)
        config.headers = headers
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const payload = error?.response?.data
        if (payload && typeof payload === 'object') {
            const backendMessage =
                (typeof payload.error === 'string' && payload.error) ||
                (typeof payload.message === 'string' && payload.message) ||
                null
            if (backendMessage) {
                error.message = backendMessage
            }
        }
        return Promise.reject(error)
    }
)

export function buildApiUrl (
    path: string,
    queryParams?: Record<string, string | number | boolean | undefined>
): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const url = new URL(`${API_BASE_URL}${cleanPath}`)
    if (queryParams) {
        Object.entries(queryParams).forEach(([ key, value ]) => {
            if (value === undefined || value === null) return
            url.searchParams.set(key, String(value))
        })
    }
    return url.toString()
}

export async function apiGet<T> (url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await apiClient.get<T>(url, config)
    return data
}

export async function apiPost<T> (url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await apiClient.post<T>(url, body, config)
    return data
}

export async function apiDelete<T> (url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await apiClient.delete<T>(url, config)
    return data
}
