<template>
    <div class="welcome-page-content py-10 sm:py-16 md:py-20 relative h-full flex items-center justify-center">
        <div class="w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div class="py-5 lg:pt-10 pb-5 text-center">
                <h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                    <span>Voicenter <br> <span class="text-primary">Opensips-JS</span> Library</span>
                </h1>
                <div class="py-5 tracking-tight mt-6 text-lg/8 lg:px-32 text-gray-900 dark:text-white space-y-3">
                    <p>
                        This library is a wrapper over the opensips-js implementation.
                        It provides a Vue 3 composable for reactive work with opensips-js functionality.
                    </p>
                </div>
            </div>
            <div class="px-5 py-8">
                <WelcomePageNavigation
                    :links="navigationLinks"
                    class="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mx-auto"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const navigationLinks = [
    {
        label: 'Documentation',
        icon: 'i-heroicons:book-open',
        link: '/docs'
    },
    {
        label: 'API',
        icon: 'i-heroicons:server-stack',
        link: '/api-docs'
    },
    {
        label: 'Example',
        icon: 'i-heroicons:window',
        link: '/example'
    }
]
</script>
