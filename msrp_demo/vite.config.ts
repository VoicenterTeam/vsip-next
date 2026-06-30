import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const rootDir = resolve(__dirname, '..')
const rootSrc = resolve(rootDir, 'src')

// The whole point of having this demo inside the same repo is to import
// the wrapper directly from ../src (e.g. `import { vsipAPI } from '../../src'`)
// so changes show up immediately via HMR - no rebuild of the library needed.
export default defineConfig({
    plugins: [ vue() ],
    resolve: {
        alias: {
            // Mirror the alias used by the wrapper internals so imports like
            // `import { MSRPConversationState } from '@/types/msrp'` keep
            // resolving when the source is loaded from ../src.
            '@': rootSrc
        },
        dedupe: [ 'vue' ]
    },
    server: {
        port: 5175,
        host: true,
        fs: {
            allow: [ rootDir ]
        }
    },
    optimizeDeps: {
        include: [ 'jssip', 'sdp-transform', 'loglevel', 'p-iteration', 'uuid', 'generate-unique-id' ]
    }
})
