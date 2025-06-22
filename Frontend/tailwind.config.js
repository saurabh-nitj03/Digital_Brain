/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
          battleshipgray: "#848482",
          mediumslateblue: "#726DD1",
        purple:{
          600:"#5046e4",
          500:"#3e38a7",
          400:"#e0e7fe",
          300:"#60626"
        },
        // slate:{
        //   200:"#f9fbfc"
        // },
        gray:{
          200:"#a9aab0",
          300:"#565b63",
          400:"#86878f",
          500:"#545561",
          600:"#232a38",
        }
      }
    },
  },
  plugins: [],
}

