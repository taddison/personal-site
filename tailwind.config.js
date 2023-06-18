const defaultTheme = require(`tailwindcss/defaultTheme`);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./site/**/*.{md,njk}", "./.eleventy.js"],
  theme: {
    extend: {
      colors: {
        "accent-1": `#EEF0F2`,
        "accent-2": `#C6C764`,
        "accent-3": `#A2999E`,
        "accent-4": `#846A6A`,
        "accent-5": `#353B3C`,
      },
      fontFamily: {
        sans: [`Atkinson Hyperlegible`, ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => {
        return {
          DEFAULT: {
            css: {
              a: {
                color: theme(`colors.blue.600`),
              },
              "code::before": null,
              "code::after": null,
              "blockquote p:first-of-type::before": null,
              "blockquote p:last-of-type::after": null,
            },
          },
        };
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
