const defaultTheme = require(`tailwindcss/defaultTheme`);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./site/**/*.{md,njk}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [`InterVariable`, ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => {
        return {
          DEFAULT: {
            css: {
              a: {
                color: theme(`colors.blue.600`),
                textDecoration: null,
                "&:hover": {
                  textDecoration: `underline`,
                },
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
