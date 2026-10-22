/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f1117',
        surface: '#1a1d27',
        sunken: '#12151e',
        expanded: '#151821',
        footer: '#0b0d12',
        line: '#2a2d3a',
        'line-soft': '#1f2230',
        foreground: '#f1f5f9',
        muted: '#94a3b8',
        subtle: '#64748b',
        soft: '#cbd5e1',
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
          lighter: '#a5b4fc'
        },
        danger: {
          DEFAULT: '#b91c1c',
          hover: '#991b1b',
          text: '#f87171'
        },
        success: {
          DEFAULT: '#4ade80',
          strong: '#16a34a',
          hover: '#15803d'
        },
        warning: '#facc15'
      },
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif']
      },
      maxWidth: {
        content: '1180px'
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'swap-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'cart-bump': {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.35) rotate(-8deg)' },
          '60%': { transform: 'scale(0.9) rotate(4deg)' },
          '100%': { transform: 'scale(1) rotate(0)' }
        },
        'badge-pop': {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' }
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.96)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        'toast-progress': {
          from: { transform: 'scaleX(1)' },
          to: { transform: 'scaleX(0)' }
        },
        'added-flash': {
          '0%': { boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.6)' },
          '100%': { boxShadow: '0 0 0 10px rgba(74, 222, 128, 0)' }
        },
        'success-in': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        draw: {
          to: { strokeDashoffset: '0' }
        },
        'row-highlight': {
          from: { background: 'rgba(99, 102, 241, 0.25)' },
          to: { background: 'transparent' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-up-fast': 'fade-up 0.25s ease-out both',
        'swap-in': 'swap-in 0.18s ease-out both',
        'cart-bump': 'cart-bump 0.5s ease',
        'badge-pop': 'badge-pop 0.35s ease',
        'toast-in': 'toast-in 0.25s ease-out',
        'toast-progress': 'toast-progress linear forwards',
        'added-flash': 'added-flash 0.6s ease-out',
        'success-in': 'success-in 0.35s ease-out',
        'draw-circle': 'draw 0.6s ease-out 0.1s forwards',
        'draw-check': 'draw 0.35s ease-out 0.6s forwards',
        'row-highlight': 'row-highlight 2.5s ease-out',
        'spin-fast': 'spin 0.7s linear infinite'
      }
    }
  },
  plugins: []
};
