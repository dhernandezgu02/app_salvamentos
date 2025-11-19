/**
 * Carga todas las carpetas hijas de la carpeta principal ordenadas por fecha de creación
 */
export const loadAllFolders = async () => {
  if (allFoldersCache) return allFoldersCache;
  if (!CONFIG.API_KEY || !CONFIG.MAIN_FOLDER_ID) return [];
  try {
    const query = encodeURIComponent(`'${CONFIG.MAIN_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder'`);
    const fields = encodeURIComponent('files(id,name,createdTime)');
    const orderBy = 'createdTime desc'; // Más recientes primero
    const url = `${CONFIG.API_BASE_URL}/files?q=${query}&orderBy=${orderBy}&key=${CONFIG.API_KEY}&fields=${fields}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.files) {
      // Agregar información de fecha a cada carpeta
      allFoldersCache = data.files.map(folder => ({
        ...folder,
        createdTime: folder.createdTime,
        createdDate: new Date(folder.createdTime)
      }));
      console.log(`📅 Carpetas ordenadas por fecha de creación (${allFoldersCache.length} encontradas)`);
      return allFoldersCache;
    }
    return [];
  } catch (error) {
    console.error('Error cargando todas las carpetas:', error);
    return [];
  }
};
/**
 * Servicio para usar Google Drive API
 * Maneja la búsqueda de carpetas por placa y obtención de imágenes
 */

import DRIVE_CONFIG from '../config/driveConfig.js';

const CONFIG = {
  // Usa la configuración centralizada
  get API_KEY() { return DRIVE_CONFIG.API_KEY; },
  get MAIN_FOLDER_ID() { return DRIVE_CONFIG.MAIN_FOLDER_ID; },
  
  // URL base de la API
  API_BASE_URL: 'https://www.googleapis.com/drive/v3',
  
  // Tipos de archivo de imagen permitidos
  IMAGE_MIMETYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ].join("' or mimeType = '")
};

/**
 * Cache para los resultados de la API
 */
const folderCache = new Map();
const fileCache = new Map();
let allFoldersCache = null; // Cache de TODAS las carpetas

/**
 * Busca una carpeta por placa en la carpeta principal
 */
export const findFolderByPlaca = async (placa) => {
  if (!placa) return null;
  try {
    const placaNormalizada = placa.trim().toUpperCase();
    const query = `name = '${placaNormalizada}' and mimeType = 'application/vnd.google-apps.folder' and '${CONFIG.MAIN_FOLDER_ID}' in parents`;
    const fields = 'files(id,name,createdTime)';
    const url = `${CONFIG.API_BASE_URL}/files?q=${encodeURIComponent(query)}&key=${CONFIG.API_KEY}&fields=${encodeURIComponent(fields)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al buscar la carpeta');
    const data = await response.json();
    if (data.files && data.files.length > 0) {
      const folder = {
        ...data.files[0],
        createdDate: new Date(data.files[0].createdTime)
      };
      console.log(`✅ Carpeta encontrada para placa ${placa}:`, folder.name, `(creada: ${folder.createdDate.toLocaleDateString()})`);
      return folder;
    } else {
      console.warn(`❌ Carpeta NO encontrada para placa ${placa}`);
      return null;
    }
  } catch (error) {
    console.error('Error buscando carpeta por placa:', error);
    return null;
  }
};

/**
 * Obtiene las imágenes de una carpeta por su ID
 */
export const getImagesFromFolderId = async (folderId) => {
  if (!folderId) return [];
  try {
    // Buscar en caché primero
    if (fileCache.has(folderId)) {
      console.log(`🗂️ Imágenes obtenidas de caché para carpeta ${folderId}`);
      return fileCache.get(folderId);
    }
    // Construir query para buscar solo imágenes en la carpeta específica
    const query = `'${folderId}' in parents and (mimeType = '${CONFIG.IMAGE_MIMETYPES}')`;
    const url = `${CONFIG.API_BASE_URL}/files?q=${encodeURIComponent(query)}&orderBy=name&key=${CONFIG.API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener archivos');
    const data = await response.json();
    if (data.files && data.files.length > 0) {
      console.log(`✅ Se encontraron ${data.files.length} imágenes en la carpeta ${folderId}`);
    } else {
      console.warn(`❌ No se encontraron imágenes en la carpeta ${folderId}`);
    }
    // Convertir resultados a URLs de imagen con dos formatos: vista previa y miniatura
    const imageUrls = data.files.map(file => {
      console.log(`🔗 Generando URLs para imagen ${file.id}`);
      // Devolvemos un objeto con ambas URLs
      const fileId = file.id;
      return {
        preview: `https://drive.google.com/file/d/${fileId}/preview`,
        thumbnail: `https://drive.google.com/uc?id=${fileId}&export=view`,
        fullsize: `https://drive.google.com/uc?id=${fileId}&export=download`
      };
    });
    // Guardar en caché
    fileCache.set(folderId, imageUrls);
    console.log(`💾 URLs guardadas en caché para carpeta ${folderId}`);
    return imageUrls;
  } catch (error) {
    console.error('Error obteniendo imágenes de la carpeta:', error);
    return [];
  }
};
// ...existing code...

/**
 * TEST de conexión (wrapper para compatibilidad)
 */
export const testDriveConnection = async () => {
  const folders = await loadAllFolders();
  return { 
    success: folders.length > 0, 
    folders,
    error: folders.length === 0 ? 'No se encontraron carpetas' : null
  };
};

export const findFolderByName = async (folderName) => {
  // Verificar cache
  if (folderCache.has(folderName)) {
    return folderCache.get(folderName);
  }
  
  if (!CONFIG.API_KEY || !CONFIG.MAIN_FOLDER_ID) {
    return null;
  }
  
  try {
    // Buscar carpeta por nombre exacto
    const query = encodeURIComponent(
      `name='${folderName}' and '${CONFIG.MAIN_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`
    );
    
    const fields = encodeURIComponent('files(id,name,createdTime)');
    const url = `${CONFIG.API_BASE_URL}/files?q=${query}&key=${CONFIG.API_KEY}&fields=${fields}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      return null;
    }
    
    if (data.files && data.files.length > 0) {
      const folder = data.files[0];
      console.log(`✅ Carpeta encontrada: "${folderName}" → ${folder.name}`);
      folderCache.set(folderName, folder.id);
      return folder.id;
    }
    
    console.warn(`⚠️ Carpeta NO encontrada: "${folderName}"`);
    return null;
  } catch (error) {
    console.error('Error buscando carpeta:', error);
    return null;
  }
};

/**
 * Lista todos los archivos de imagen en una carpeta
 */
export const listImagesInFolder = async (folderId) => {
  // Activamos el caché para reducir solicitudes
  if (fileCache.has(folderId)) {
    return fileCache.get(folderId);
  }
  
  if (!CONFIG.API_KEY) {
    console.warn('Google Drive API no configurada');
    return [];
  }
  
  try {
    // Construir query para buscar imágenes (limitado a 5 para evitar sobrecarga)
    const query = encodeURIComponent(
      `'${folderId}' in parents and (mimeType contains 'image/')`
    );
    
    const fields = encodeURIComponent('files(id,name,mimeType)');
    // Agregamos pageSize=5 para limitar resultados y evitar error 429
    const url = `${CONFIG.API_BASE_URL}/files?q=${query}&key=${CONFIG.API_KEY}&fields=${fields}&orderBy=name&pageSize=5`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error(`Error de API:`, data.error);
      return [];
    }
    
    if (data.files && data.files.length > 0) {
      // Convertir IDs a URLs de vista previa pública
      const imageUrls = data.files.map(file => {
        // Usar URL de vista previa pública que no requiere autenticación
        // Formato que funciona incluso con archivos no compartidos públicamente
        return `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
      });
      
      // Activamos el caché para reducir solicitudes
      fileCache.set(folderId, imageUrls);
      return imageUrls;
    }
    
    return [];
  } catch (error) {
    console.error(`Error listando imágenes:`, error);
    return [];
  }
};

// ...existing code...

/**
 * Obtiene las imágenes para un vehículo usando la API
 * Busca la carpeta por nombre (método menos eficiente)
 */
export const getImagesForVehicle = async (marca, modelo, año) => {
  const folderName = normalizeVehicleName(marca, modelo, año);
  
  try {
    // Asegurarse de que tenemos el cache de carpetas
    if (!allFoldersCache) {
      await loadAllFolders();
    }
    
    // Buscar en el cache
    const folderId = findFolderInCache(folderName);
    
    if (!folderId) {
      return [];
    }
    
    // Listar imágenes en la carpeta
    return await listImagesInFolder(folderId);
  } catch (error) {
    console.error(`Error obteniendo imágenes:`, error);
    return [];
  }
};

/**
 * Limpia todos los caches
 */
export const clearCache = () => {
  folderCache.clear();
  fileCache.clear();
  allFoldersCache = null;
};

// Limpiar el caché al iniciar la aplicación
clearCache();

/**
 * Actualiza la configuración
 */
export const updateConfig = (newConfig) => {
  Object.assign(CONFIG, newConfig);
  clearCache();
};

/**
 * Verifica si la API está configurada
 */
export const isConfigured = () => {
  return !!(CONFIG.API_KEY && CONFIG.MAIN_FOLDER_ID && CONFIG.MAIN_FOLDER_ID !== 'TU_FOLDER_ID_AQUI');
};

export default {
  getImagesForVehicle,
  getImagesFromFolderId,
  findFolderByName,
  listImagesInFolder,
  clearCache,
  updateConfig,
  isConfigured,
  testDriveConnection,
  loadAllFolders,
  findFolderByPlaca,
};

