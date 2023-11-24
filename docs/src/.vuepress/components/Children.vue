<template>
    <pre>
        {{ state.activeCalls }}
    </pre>
</template>

<script setup lang="ts">
import { useVsipInject } from '@/index'

const { state } = useVsipInject()
</script>
