// /** @type {import('tailwindcss').Config} */
// export default {
//   content:["./src/**/*.{html,js,jsx,ts,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Ensure all relevant files are included
  theme: {
    extend: {
      colors: {
        "cancer-blue": "#3b82f6",
        "cancer-purple": "#8b5cf6",
        "cancer-teal": "#14b8a6",
        "cancer-dark": "#1e293b",
      },
    },
  },
  plugins: [],
};

