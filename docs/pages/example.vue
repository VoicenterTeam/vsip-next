<script setup lang="ts">
useSeoMeta({
    titleTemplate: '%s | OpenSIPSJS',
    title: 'Demo',
    ogTitle: 'Demo',
    description: 'This library is a wrapper over the opensips-js implementation.',
    ogDescription: 'This library is a wrapper over the opensips-js implementation.'
})
</script>

<template>
    <div class="example-page w-full h-full">
        <ClientOnly>
            <LazyExampleContent />
        </ClientOnly>
    </div>
</template>
