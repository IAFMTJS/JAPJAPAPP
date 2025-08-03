/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'japanese': ['Kosugi Maru', 'Noto Sans JP', 'sans-serif'],
      },
      colors: {
        'japanese-red': '#DC2626',
        'japanese-red-light': '#EF4444',
        'japanese-gold': '#F59E0B',
        'japanese-blue': '#1E40AF',
        'japanese-green': '#059669',
        'japanese-purple': '#7C3AED',
        'japanese-pink': '#EC4899',
        'japanese-orange': '#F97316',
        'japanese-cyan': '#0891B2',
        'japanese-lime': '#84CC16',
        'japanese-rose': '#E11D48',
        'japanese-indigo': '#4F46E5',
        'japanese-emerald': '#10B981',
        'japanese-violet': '#8B5CF6',
        'japanese-fuchsia': '#D946EF',
        'japanese-sky': '#0EA5E9',
        'japanese-teal': '#14B8A6',
        'japanese-amber': '#F59E0B',
        'japanese-slate': '#64748B',
        'japanese-gray': '#6B7280',
        'japanese-zinc': '#71717A',
        'japanese-neutral': '#737373',
        'japanese-stone': '#78716C',
      },
      backgroundImage: {
        'seigaiha': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23f3f4f6\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'mascot-bounce': 'mascot-bounce 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'rainbow-glow': 'rainbow-glow 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'bounce': 'bounce 1s ease-in-out',
        'pulse': 'pulse 2s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'flash': 'flash 1s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(220, 38, 38, 0.6)',
          },
        },
        'mascot-bounce': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'shimmer': {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        'rainbow-glow': {
          '0%': {
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)',
          },
          '25%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
          },
          '75%': {
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
          },
          '100%': {
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)',
          },
        },
      },
      animationDelay: {
        '2000': '2s',
        '4000': '4s',
      },
    },
  },
  plugins: [],
}

