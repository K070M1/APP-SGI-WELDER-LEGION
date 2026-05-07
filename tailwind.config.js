/** @type {import('tailwindcss').Config} */
const { COLORS } = require('./src/shared/constants/colors');

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Mapeo de colores primarios
        primary: {
          DEFAULT: COLORS.primary.main,
          foreground: COLORS.primary.text,
          50: COLORS.primary.light,
          500: COLORS.primary.main,
          900: COLORS.primary.dark,
        },
        // Mapeo de colores de éxito
        success: {
          DEFAULT: COLORS.success.main,
          foreground: COLORS.success.text,
          50: COLORS.success.light,
          500: COLORS.success.main,
          900: COLORS.success.dark,
        },
        // Mapeo de colores de error/destrucción
        destructive: {
          DEFAULT: COLORS.error.main,
          foreground: COLORS.error.text,
          50: COLORS.error.light,
          500: COLORS.error.main,
          900: COLORS.error.dark,
        },
        // Mapeo de colores de advertencia
        warning: {
          DEFAULT: COLORS.warning.main,
          foreground: COLORS.warning.text,
          50: COLORS.warning.light,
          500: COLORS.warning.main,
          900: COLORS.warning.dark,
        },
        // Mapeo de colores de información
        info: {
          DEFAULT: COLORS.info.main,
          foreground: COLORS.info.text,
          50: COLORS.info.light,
          500: COLORS.info.main,
          900: COLORS.info.dark,
        },
        // Mapeo de colores neutrales
        secondary: {
          DEFAULT: COLORS.neutral.main,
          foreground: COLORS.neutral.text,
        },
        // Mapeo de colores de fondo
        background: {
          DEFAULT: COLORS.background.primary,
          secondary: COLORS.background.secondary,
          tertiary: COLORS.background.tertiary,
        },
        // Mapeo de colores de texto
        foreground: COLORS.text.primary,
        muted: {
          DEFAULT: COLORS.text.secondary,
          foreground: COLORS.text.disabled,
        },
        accent: {
          DEFAULT: COLORS.neutral.light,
          foreground: COLORS.text.primary,
        },
        // Mapeo de colores de borde
        border: COLORS.border.main,
        input: COLORS.neutral.main,
        ring: COLORS.primary.main,
        // Mapeo de colores de card
        card: {
          DEFAULT: COLORS.background.secondary,
          foreground: COLORS.text.primary,
        },
        // Mapeo de colores de popover
        popover: {
          DEFAULT: COLORS.background.secondary,
          foreground: COLORS.text.primary,
        },
        // Mapeo de colores de modal/dialog
        modal: {
          DEFAULT: COLORS.background.secondary,
          foreground: COLORS.text.primary,
        },
      },
    },
  },
  plugins: [],
};