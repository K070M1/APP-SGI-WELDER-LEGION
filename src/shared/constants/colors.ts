/**
 * Paleta de Colores Global - APP-SGI-WELDER-LEGION
 * Basada en psicología del color y accesibilidad
 * Principio 50/30/20: 50% claro, 30% oscuro, 20% comunicativo
 */

export const COLORS = {
  // PRIMARIOS - Azul (Acción, CTA, Información)
  primary: {
    light: '#E3E6FF',     // 50% - Fondo claro
    main: '#748FFC',      // 20% - Botones, acciones principales
    dark: '#4A5ACD',      // 30% - Hover, estados activos
    text: '#FFFFFF',      // Texto sobre fondo
  },

  // ÉXITO - Verde Pastel
  success: {
    light: '#D6F7E8',     // 50% - Fondo claro
    main: '#69DB7C',      // 20% - Íconos, botones éxito
    dark: '#4AA95E',      // 30% - Hover
    text: '#FFFFFF',      // Texto sobre fondo
  },

  // ERROR - Rojo Pastel
  error: {
    light: '#FFE8E8',     // 50% - Fondo claro
    main: '#FF8787',      // 20% - Botones, íconos de error
    dark: '#E74C3C',      // 30% - Hover
    text: '#FFFFFF',      // Texto sobre fondo
  },

  // ADVERTENCIA - Amarillo/Naranja Pastel
  warning: {
    light: '#FFF3D9',     // 50% - Fondo claro
    main: '#FFB84D',      // 20% - Íconos, botones advertencia
    dark: '#F39C12',      // 30% - Hover
    text: '#FFFFFF',      // Texto sobre fondo
  },

  // INFORMACIÓN - Azul Claro
  info: {
    light: '#D6EBF5',     // 50% - Fondo claro
    main: '#5DADE2',      // 20% - Íconos, información
    dark: '#3498DB',      // 30% - Hover
    text: '#FFFFFF',      // Texto sobre fondo
  },

  // NEUTRAL - Grises (Disabled, Secundario)
  neutral: {
    light: '#F1F5F9',     // 50% - Fondo muy claro
    main: '#CBD5E1',      // 20% - Bordes, dividers
    dark: '#64748B',      // 30% - Texto secundario
    text: '#1E293B',      // Texto sobre fondo
  },

  // ESCALA DE GRISES PARA TEXTO
  text: {
    primary: '#1F2937',   // Texto principal (muy oscuro)
    secondary: '#6B7280', // Texto secundario
    disabled: '#9CA3AF',  // Texto deshabilitado
    light: '#E5E7EB',     // Texto sobre fondo oscuro
  },

  // BACKGROUNDS
  background: {
    primary: '#F8FAFC',   // Fondo principal
    secondary: '#FFFFFF', // Fondo secundario (cards, modales)
    tertiary: '#F1F5F9',  // Fondo terciario
  },

  // BORDES
  border: {
    light: '#E2E8F0',
    main: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

/**
 * Mapeo de colores de acciones en modales
 * Usado en UiOverlayContext para traducir color string -> color hex
 */
export const ACTION_COLORS = {
  white: {
    bg: COLORS.background.secondary,
    border: COLORS.neutral.main,
    text: COLORS.text.primary,
  },
  blue: {
    bg: COLORS.primary.main,
    text: COLORS.primary.text,
  },
  orange: {
    bg: COLORS.warning.main,
    text: COLORS.warning.text,
  },
  green: {
    bg: COLORS.success.main,
    text: COLORS.success.text,
  },
  red: {
    bg: COLORS.error.main,
    text: COLORS.error.text,
  },
};

/**
 * Mapeo de íconos a colores en alertas
 */
export const ALERT_ICON_COLORS = {
  success: COLORS.success.main,
  error: COLORS.error.main,
  warning: COLORS.warning.main,
  info: COLORS.info.main,
  loading: COLORS.primary.main,
};
