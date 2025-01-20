/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",

        green: "#399918",
        // green: "#ef233c",

        gray: "#edf2f4",
        lightgray: "#dfe5ea",
        background: "#2b2d42",
      },
      fontFamily: {
        blinker: ["Blinker"],
        poppins: ["Poppins"],
      },
    },
  },

  plugins: [],
};
