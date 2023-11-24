import { ref } from 'vue'
import { VsipAPI } from '@/types'

const activeCalls = ref<number>(0)

export const vsipAPI: VsipAPI = {
    state: {
        activeCalls: activeCalls
    },
    actions: {
        setActiveCalls (value: number): number {
            activeCalls.value = value

            return activeCalls.value
        }
    }
}
