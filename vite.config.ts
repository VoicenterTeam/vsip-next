import { resolve, join } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import Inspect from 'vite-plugin-inspect'

const OUTPUT_DIR = 'library'

export default ({ mode }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd(), '')
    }
    return defineConfig({
        server: {
            host: process.env.VITE_BASE_HOST,
            port: +process.env.VITE_BASE_PORT
        },
        plugins: [
            vue(),
            dts({
                outDir: join(OUTPUT_DIR, 'types')
            }),
            Inspect()
        ],
        build: {
            outDir: OUTPUT_DIR,
            sourcemap: true,
            commonjsOptions: {
                esmExternals: true
            },
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                name: 'vsip-next',
                fileName: 'super'
            },
            rollupOptions: {
                external: [ 'vue' ],
                output: {
                    dir: OUTPUT_DIR,
                    globals: {
                        vue: 'Vue',
                    }
                }
            }
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './src')
            }
        }
    })
}
