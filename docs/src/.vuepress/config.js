import { defineUserConfig, defaultTheme } from 'vuepress'
import { description } from '../../package'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { getDirname, path } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
    description: description,

    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}],
        ['meta', {name: 'theme-color', content: '#2675FF'}],
        ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
        ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: '#2675FF'}]
    ],

    theme: defaultTheme({
        repo: '',
        editLinks: false,
        logo: '/images/logo.png',
        docsDir: '',
        editLinkText: '',
        colorMode: 'light',
        lastUpdated: false,
        sidebar: [
            {
                text: 'General',
                link: '/',
                collapsible: false,
                children: [
                    'components',
                    'parameters',
                    'types',
                    'example'
                ]
            }
        ]
    }),

    plugins: [
        registerComponentsPlugin({
            componentsDir: path.resolve(__dirname, './components')
        })
    ],

    alias: {
        '@': path.resolve(__dirname, '../', '../', '../', 'src'),
    }
})
