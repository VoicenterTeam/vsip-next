import { defineClientConfig } from '@vuepress/client'
import '@voicenter-team/voicenter-ui-plus/library/style.css'

export default defineClientConfig({
    enhance({ app, router, siteData }) {
        if (typeof window !== 'undefined') {
            // Dynamically import the library only on client side
            import('@voicenter-team/voicenter-ui-plus').then((VoicenterUI) => {
                app.use(VoicenterUI.default)
            })
        }
    },
    setup() {},
    rootComponents: [],
})
