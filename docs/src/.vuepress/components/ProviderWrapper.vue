<template>
    <div ref="wrapper">
        <VSipPhone v-if="isInitialized" />
        <div v-else>
            <Login />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import VSipPhone from './VSipPhone.vue'
import Login from './Login.vue'
import { useVsipProvide } from '@/index'
//import { useVsipProvide } from '../../../../library/super.mjs'

const isInitialized = computed(() => {
    return state && state.isInitialized.value
})

const { state } = useVsipProvide()

</script>

<style lang="css" src="@voicenter-team/voicenter-ui-plus/library/style.css"></style>
