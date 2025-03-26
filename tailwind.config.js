// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./pages/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
        colors: {
            'theme-gray-1': '#1e1e1e',
            'theme-gray-2': '#272727',
            'input': '#404040',
            'btn': '#9b59b6',
            'theme-pink': '#9B59B6',
            "dark-transparent": "rgba(0, 0, 0, 0.37)"
        },
        backgroundImage: {
            'login': "url('/public/images/mainWalp.jpg')",
        },
        height: {
            'spec-screen': 'calc(100vh - 66px)',
        },
        animation: {
            'fadeIn': 'fadeIn 0.5s ease 2.1s forwards',
            'spin-slow': 'spin78236 2s linear infinite',
            'wobble1': 'wobble1 0.8s infinite ease-in-out',
            'wobble2': 'wobble2 0.8s infinite ease-in-out',
            'gradient': 'gradient-animation 4s infinite',
            'exufy': 'exufy 2s cubic-bezier(.9,.02,.27,.99) forwards',
            'nMove': 'nMove 2s cubic-bezier(.9,.02,.27,.99) forwards',
        },
        keyframes: {
            fadeIn: {
                from: { opacity: '0' },
                to: { opacity: '1' }
            },
            spin78236: {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' }
            },
            wobble1: {
                '0%, 100%': { transform: 'translateY(0%) scale(1)', opacity: '1' },
                '50%': { transform: 'translateY(-66%) scale(0.65)', opacity: '0.8' },
            },
            wobble2: {
                '0%, 100%': { transform: 'translateY(0%) scale(1)', opacity: '1' },
                '50%': { transform: 'translateY(66%) scale(0.65)', opacity: '0.8' },
            },
            gradientAnimation: {
                '0%': { backgroundPosition: '0 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0 50%' },
            },
            exufy: {
                '0%': { opacity: '0', transform: 'translateX(-100%)', clipPath: 'inset(0 100% 0 0)' },
                '55%': { opacity: '0', clipPath: 'inset(0 0 0 0)' },
                '100%': { opacity: '1', transform: 'translateX(0)', clipPath: 'inset(0 0 0 0)' },
            },
            nMove: {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-83px)' },
            },
        },
        fontFamily: {
            'logo-font': ['Logo'],
            'title-font': ['Red Hat'],
            'title-font-bold': ['Red Hat Bold'],
            'text-font': ['Open Sans Regular'],
            'text-font-bold': ['Open Sans Bold'],
        }
    }
},
plugins: [],
}
