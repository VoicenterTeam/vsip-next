<template>
    <div ref="wrapper">
        <Children v-if="state.isInitialized" />
        <div v-else>Not initialized</div>
    </div>
</template>

<script lang="ts" setup>
import Children from './Children.vue'
import { useVsipProvide } from '@/index'
//import { useVsipProvide } from '../../../../library/super.mjs'

const { actions, state } = useVsipProvide()
actions.init('wss07.voicenter.co', '', '')
</script>

<style lang="css" src="@voicenter-team/voicenter-ui-plus/library/style.css"></style>
