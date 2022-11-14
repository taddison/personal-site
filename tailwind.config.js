const defaultTheme = require(`tailwindcss/defaultTheme`);

module.exports = {
  mode: `jit`,
  purge: [`./src/**/*.js`],
  theme: {
    extend: {
      opacity: {
        35: `.35`,
      },
      colors: {
        "accent-1": `#EEF0F2`,
        "accent-2": `#C6C764`,
        "accent-3": `#A2999E`,
        "accent-4": `#846A6A`,
        "accent-5": `#353B3C`,
      },
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
  variants: {},
  plugins: [require(`@tailwindcss/typography`)],
};
