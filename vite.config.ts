import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

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
                rollupTypes: true,
                copyDtsFiles: true,
                bundledPackages: [
                    '@voicenter-team/opensips-js'
                ]
            }),
        ],
        build: {
            outDir: OUTPUT_DIR,
            sourcemap: true,
            target: 'es6',
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
        base: './',
        resolve: {
            alias: {
                '@': resolve(__dirname, './src')
            }
        }
    })
}
