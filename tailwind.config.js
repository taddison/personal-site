/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./blog/**/*.md"],
  theme: {
    extend: {
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
