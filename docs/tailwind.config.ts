import type { Config } from 'tailwindcss'
// import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        extend: {
            colors: {
                red: {
                    50: '#ffece9',
                    100: '#ffd9d2',
                    200: '#feb2a6',
                    300: '#f47465',
                    400: '#ef5c4e',
                    500: '#e31515',
                    600: '#c51111',
                    700: '#a80c0c',
                    800: '#8c0808',
                    900: '#710505',
                    950: '#3f0202'
                }
            }
        }
    }
}
