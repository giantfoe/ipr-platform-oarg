/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@solana/wallet-adapter-react-ui/styles.css',
    './node_modules/react-icons/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#635BFF',
        secondary: '#0A2540',
        accent: '#00D4FF',
        background: {
          light: '#ffffff',
          dark: '#0A2540',
          gray: '#F6F9FC',
        },
        text: {
          primary: '#0A2540',
          secondary: '#425466',
          light: '#ffffff',
        },
        border: {
          light: '#E6E6E6',
          dark: '#425466',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '3rem',
      },
    },
  },
  plugins: [],
}

