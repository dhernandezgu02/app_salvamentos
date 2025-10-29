/**
 * Utilidades compartidas para los servicios
 */

/**
 * Normaliza el nombre de un vehículo para usarlo en búsquedas
 * Convierte "BMW X4 Xdrive 30i 2023" -> "BMW X4 Xdrive 30i 2023"
 */
export const normalizeVehicleName = (marca, modelo, año) => {
  // Simplemente usar el nombre como está, con espacios
  return `${marca} ${modelo} ${año}`;
};

/**
 * Formatea un precio en pesos colombianos
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Formatea kilometraje
 */
export const formatKilometers = (km) => {
  return new Intl.NumberFormat('es-CO').format(km) + ' km';
};

/**
 * Valida si una URL es válida
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Convierte ID de Drive a URL directa
 */
export const driveIdToUrl = (id) => {
  return `https://drive.google.com/uc?export=view&id=${id}`;
};

/**
 * Extrae ID de una URL de Drive
 */
export const extractDriveId = (url) => {
  const match = url.match(/\/d\/([^\/]+)/);
  return match ? match[1] : null;
};

export default {
  normalizeVehicleName,
  formatPrice,
  formatKilometers,
  isValidUrl,
  driveIdToUrl,
  extractDriveId,
};

