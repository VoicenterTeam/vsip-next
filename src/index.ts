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
