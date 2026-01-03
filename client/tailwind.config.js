/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                saffron: {
                    DEFAULT: '#FF9933',
                    dark: '#CC7A29',
                    light: '#FFB870'
                },
                royal: {
                    DEFAULT: '#0F5132',
                    light: '#198754'
                },
                gold: {
                    DEFAULT: '#D4AF37',
                    light: '#F4D06F',
                    dark: '#AA8C2C'
                },
                cream: {
                    DEFAULT: '#FFF8EE',
                    dark: '#F5E6D3'
                },
                dark: {
                    DEFAULT: '#0B0B0B',
                    card: '#1A1A1A'
                }
            },
            fontFamily: {
                desicon: ['Poppins', 'sans-serif'],
                premium: ['Playfair Display', 'serif'],
                body: ['Inter', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
