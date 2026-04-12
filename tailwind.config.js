/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0F1117',
                    secondary: '#1A1D27',
                    tertiary: '#242837',
                    surface: '#2A2F3E',
                },
                accent: {
                    primary: '#10B981',
                    hover: '#059669',
                },
                app: {
                    paytm: '#00BAF2',
                    phonepe: '#5F259F',
                    gpay: '#4285F4',
                    amazon: '#FF9900',
                    swiggy: '#FC8019',
                    zomato: '#E23744',
                }
            },
            fontFamily: {
                sans: ['DM Sans', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}