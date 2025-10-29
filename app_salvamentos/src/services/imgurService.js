/**
 * Servicio para obtener imágenes desde Imgur
 * Esta es una alternativa más confiable a Google Drive
 * 
 * Usa álbumes de Imgur como equivalente a carpetas en Drive
 */

import DRIVE_CONFIG from '../config/driveConfig.js';

/**
 * Cache para almacenar los resultados
 */
const imageCache = new Map();
const albumCache = new Map();

/**
 * Obtiene las imágenes para un vehículo desde Imgur usando su CarpetaID
 */
export const getImagesForVehicle = async (vehiculo) => {
  const { CarpetaID } = vehiculo;
  
  // Verificar cache
  if (imageCache.has(CarpetaID)) {
    return imageCache.get(CarpetaID);
  }
  
  try {
    // Obtener el ID del álbum de Imgur correspondiente a esta carpeta
    const albumId = DRIVE_CONFIG.IMGUR_ALBUMS[CarpetaID] || DRIVE_CONFIG.DEFAULT_ALBUM;
    
    // Obtener las imágenes del álbum
    const images = await getImagesFromAlbum(albumId);
    
    // Guardar en cache
    imageCache.set(CarpetaID, images);
    return images;
  } catch (error) {
    console.error('Error obteniendo imágenes de Imgur:', error);
    return [DRIVE_CONFIG.DEFAULT_IMAGE];
  }
};

/**
 * Obtiene las imágenes de un álbum de Imgur
 */
const getImagesFromAlbum = async (albumId) => {
  // Verificar cache
  if (albumCache.has(albumId)) {
    return albumCache.get(albumId);
  }
  
  try {
    // Ejemplo de álbum: https://imgur.com/a/zXUQzMC
    // Imágenes de ejemplo (para demostración)
    const images = [
      `https://i.imgur.com/JlVKy9Y.jpeg`,
      `https://i.imgur.com/8oNdFXf.jpeg`,
      `https://i.imgur.com/GQYlG4k.jpeg`,
      `https://i.imgur.com/JCwYzxA.jpeg`,
      `https://i.imgur.com/Yo3TN6D.png`
    ];
    
    // En una implementación real, aquí se haría una solicitud a la API de Imgur
    // para obtener las imágenes del álbum
    
    // Guardar en cache
    albumCache.set(albumId, images);
    return images;
  } catch (error) {
    console.error(`Error obteniendo imágenes del álbum ${albumId}:`, error);
    return [DRIVE_CONFIG.DEFAULT_IMAGE];
  }
};

/**
 * Limpia el cache de imágenes
 */
export const clearCache = () => {
  imageCache.clear();
  albumCache.clear();
};

export default {
  getImagesForVehicle,
  clearCache
};
