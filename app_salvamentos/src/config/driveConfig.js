/**
 * Configuración centralizada para Google Drive
 * 
 * Archivo único para configurar el acceso a Drive
 */

export const DRIVE_CONFIG = {
  // ============================================
  // CONFIGURACIÓN PRINCIPAL
  // ============================================
  
  // ID de la carpeta principal en Drive que contiene las carpetas de vehículos
  // Ejemplo: https://drive.google.com/drive/folders/[ESTE_ID]
  MAIN_FOLDER_ID: '1Z5UBzS8wDxvv3jkWAt02cQB5bfDtNNLD',
  
  // API Key de Google (opcional, para usar Drive API)
  // Obtén una en: https://console.cloud.google.com/apis/credentials
  API_KEY: 'AIzaSyDgoT4OPs5LgfFX7g47Uah8n9Z31nGJgQA',
  
  // ============================================
  // MODO DE OPERACIÓN
  // ============================================
  
  // Modo de obtención de imágenes:
  // 'api' - Usa Google Drive API (requiere API_KEY, más confiable)
  // 'simple' - URLs predecibles basadas en nombres (sin API, más simple)
  // 'imgur' - Usa Imgur como repositorio de imágenes (más confiable)
  IMAGE_MODE: 'imgur',
  
  // ============================================
  // CONFIGURACIÓN AVANZADA
  // ============================================
  
  // Extensiones de imagen soportadas
  IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'],
  
  // Máximo de imágenes a intentar cargar por vehículo
  MAX_IMAGES: 10,
  
  // Tiempo de cache en milisegundos (5 minutos)
  CACHE_DURATION: 5 * 60 * 1000,
  
  // Habilitar logs de debug
  DEBUG: false,
  
  // ID de imagen de respaldo (debe ser una imagen en Drive)
  FALLBACK_IMAGE_ID: '1b--_hE0pAa_L9Uoj7QSFfTJpH7Nmwxqu',
  
  // ============================================
  // CONFIGURACIÓN DE IMGUR
  // ============================================
  
  // Configuración de álbumes de Imgur
  // Cada carpeta corresponde a un álbum en Imgur
  IMGUR_ALBUMS: {
    // ID de carpeta en Drive : ID de álbum en Imgur
    // Ejemplo: https://imgur.com/a/ALBUM_ID
    '19bE9bcXN_DC72cFDTLbBUGjd4QWb60Vh': 'zXUQzMC', // BMW X4 Xdrive 30i 2023
    '1vL6J6VTysvkYXZIBW9h4VVfpZtQiyg3Y': 'zXUQzMC', // FORD Expedition 2019
    '1_FXxsBIkhXrniCm3t6Uf1RLMoiWZCaVk': 'zXUQzMC', // MAZDA 2 Prime 2019
  },
  
  // Álbum por defecto para vehículos sin álbum específico
  DEFAULT_ALBUM: 'zXUQzMC',
  
  // Imagen por defecto para vehículos sin imágenes
  DEFAULT_IMAGE: 'https://i.imgur.com/Yo3TN6D.png',
};

/**
 * Valida la configuración
 */
export const validateConfig = () => {
  const errors = [];
  
  if (!DRIVE_CONFIG.MAIN_FOLDER_ID || DRIVE_CONFIG.MAIN_FOLDER_ID === 'TU_FOLDER_ID_AQUI') {
    errors.push('MAIN_FOLDER_ID no configurado');
  }
  
  if (DRIVE_CONFIG.IMAGE_MODE === 'api' && !DRIVE_CONFIG.API_KEY) {
    errors.push('API_KEY requerida para modo "api"');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Verifica si el modo API está disponible
 */
export const isApiMode = () => {
  return DRIVE_CONFIG.IMAGE_MODE === 'api' && !!DRIVE_CONFIG.API_KEY;
};

export default DRIVE_CONFIG;

