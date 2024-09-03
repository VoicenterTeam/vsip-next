/* eslint-env node */
module.exports = {
    root: true,
    extends: '@voicenter-team/vue',
    env: {
        'vue/setup-compiler-macros': true,
        es2021: true,
        node: true
    },
    ignorePatterns: [
        'src/vendors/*',
        'scripts/*',
        'docs'
    ]
}
