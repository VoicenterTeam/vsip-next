import type { Ref } from 'vue'

export interface VsipAPI {
    state: VsipAPIState
    actions: VsipAPIActions
}

export interface VsipAPIState {
    activeCalls: Ref<number>
}

export interface VsipAPIActions {
    init(domain: string, username: string, password: string): void
    setActiveCalls: (value: number) => number
}

export interface DoCallHoldParamsType {
    callId: string
    toHold: boolean
    automatic?: boolean
}
