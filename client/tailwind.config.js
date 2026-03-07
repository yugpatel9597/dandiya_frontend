/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                // Primary is now mapping to Indigo/Violet tones
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                // "Gold" is now mapping to vibrant Teal/Cyan accents
                gold: {
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    900: '#164e63',
                },
                // "Maroon" is now mapping to deep Slate/Blue-gray for backgrounds and secondary dark accents
                maroon: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Playfair Display', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-gold': 'pulseGold 2s infinite',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
                slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
                pulseGold: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(6, 182, 212, 0.4)' }, '70%': { boxShadow: '0 0 0 10px rgba(6, 182, 212, 0)' } },
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #6366f1 70%, #06b6d4 100%)',
                'card-gradient': 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
            },
        },
    },
    plugins: [],
};
