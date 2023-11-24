import type { Ref } from 'vue'

export interface VsipAPI {
    state: VsipAPIState
    actions: VsipAPIActions
}

export interface VsipAPIState {
    activeCalls: Ref<number>
}

export interface VsipAPIActions {
    setActiveCalls: (value: number) => number
}
