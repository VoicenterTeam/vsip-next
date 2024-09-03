// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
    devtools: { enabled: true },
    extends: [
        [ 'github:VoicenterTeam/documentation-template', { install: true } ]
    ],
    routeRules: {
        '/': { prerender: true }
    },
    uiTypedoc: {
        typesGenerate: true,
        entryPoints: [ resolve(__dirname, '../library/index.d.ts') ]
    },
    css: [
        // join(currentDirLocal, 'assets/css/main.css'),
        './assets/css/tailwind.css'
    ],
    alias: {
        '@': resolve(__dirname, '../src')
    }
})
