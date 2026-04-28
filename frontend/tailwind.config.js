/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgba(249, 115, 22, 0.1)',
          100: 'rgba(249, 115, 22, 0.2)',
          200: 'rgba(249, 115, 22, 0.3)',
          300: 'rgba(249, 115, 22, 0.4)',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        accent: {
          500: '#F97316',
          600: '#EA580C',
        },
        // 深色主题颜色
        dark: {
          bg: '#0D0D0D',
          card: '#1F1F1F',
          lighter: '#27272A',
          border: '#3F3F46',
          borderHover: '#52525B',
          text: '#FAFAFA',
          textSecondary: '#9CA3AF',
        },
        // 绿色（录音等状态）
        green: {
          accent: '#22C55E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
