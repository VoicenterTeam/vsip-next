<template>
    <div ref="containerRef" class="example-content py-8 flex items-center justify-center">
        <div class="w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div ref="wrapper">
                <div v-if="isInitialized" class="flex justify-center text-black">
                    <div class="w-full max-w-lg bg-gray-100 p-8 rounded ">
                        <VSipPhone />
                    </div>
                </div>
                <div
                    v-else
                    class="flex justify-center"
                >
                    <div class="w-full max-w-lg bg-gray-100 p-8 rounded">
                        <LoginComponent />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useVsipProvide } from '@/index'
import { computed } from 'vue'
import LoginComponent from '~/components/LoginComponent.vue'

const { state } = useVsipProvide()
const containerRef = ref()

const isInitialized = computed(() => {
    return state && state.isInitialized.value
})

</script>

<style lang="scss">
</style>

