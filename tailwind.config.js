const defaultTheme = require(`tailwindcss/defaultTheme`)

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: false,
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
        sans: [`Inter var`, ...defaultTheme.fontFamily.sans],
      },
    },
    typography: (theme) => {
      return {
        default: {
          css: {
            "code::before": { content: `` },
            "code::after": { content: `` },
            a: {
              color: theme(`colors.blue.600`),
              textDecoration: `none`,
              "&:hover": {
                textDecoration: `underline`,
              },
            },
            "blockquote p:first-of-type::before": {
              content: ``,
            },
            "blockquote p:last-of-type::after": {
              content: ``,
            },
          },
        },
      }
    },
  },
  variants: {},
  plugins: [require(`@tailwindcss/ui`)],
}
