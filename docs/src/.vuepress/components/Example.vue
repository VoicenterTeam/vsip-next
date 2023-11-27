<template>
    <div ref="wrapper">
        <Children />
    </div>
</template>

<script lang="ts" setup>
import Children from './Children.vue'
import { useVsipProvide } from '@/index'

const { actions } = useVsipProvide()
</script>

<style lang="css" src="@voicenter-team/voicenter-ui-plus/library/style.css"></style>
