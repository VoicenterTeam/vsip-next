import { version } from '../package.json'

export default defineAppConfig({
    ui: {
        primary: 'red',
        gray: 'slate',
        appLogo: {
            width: '164px',
            height: 'auto',
            maxWidth: '164px'
        },
    },
    seo: {
        siteName: 'OpensipsJs',
        siteDescription: 'This library is a wrapper over the opensips-js implementation',
        docsHeaderTemplate: '%s | OpensipsJs',
        apiHeaderTemplate: '%s | OpensipsJs',
        indexHeaderTemplate: 'Project Overview | OpensipsJs'
    },
    header: {
        version,
        showSiteName: true
    },
    // footer: {
    //
    // }
})
