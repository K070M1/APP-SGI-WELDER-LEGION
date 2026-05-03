export const AXIOS_ERRORS_MAPPER: Record<string, string> = {
  ERR_NETWORK: "Error de red. Verifica tu conexión a internet e inténtalo de nuevo.",
  ECONNABORTED: "La conexión ha tardado demasiado (Timeout). Inténtalo de nuevo.",
  ERR_BAD_REQUEST: "Solicitud incorrecta. Verifica los datos enviados.",
  ERR_BAD_RESPONSE: "Error interno del servidor. Nuestro equipo ya ha sido notificado.",
  ERR_CANCELED: "La solicitud fue cancelada.",
  ETIMEDOUT: "Tiempo de espera agotado. Verifica tu conexión.",
};