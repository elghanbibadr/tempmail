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
        lightBlue: "#a78bfa",
        lightGrey: "#6b7280e0",
        darkPink: "#6d28d9",
        secondary: "#030712",
        lighterPink: "#a78bfa",
        accent1: "#1f2937",
      },
      boxShadow: {
        grayBoxShadow: "0 1px 3px 0 #334155",
        pinkBoxShadow: "0 14px 49px 0 #6c28d94c",
        pinkBoxShadow2: " 0 2px 1119px 10px #6c28d94c",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
