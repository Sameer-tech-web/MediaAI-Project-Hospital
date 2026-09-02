/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        medBlue: '#2563eb',
        medWhite: '#f8fafc',
        medSuccess: '#16a34a',
        medDanger: '#dc2626',
      },
    },
  },
  plugins: [],
};
