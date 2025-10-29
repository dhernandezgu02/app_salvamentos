/**
 * Servicio para obtener datos desde Google Sheets
 */

import driveApiService from './driveApiService.js';
import imgurService from './imgurService.js';
import DRIVE_CONFIG from '../config/driveConfig.js';

const CONFIG = {
  // ID de tu Google Sheet (ID original, NO el publicado)
  SHEET_ID: '1Ix_GV3b-PJc6b4bXOR-ghVPzbOvHknIr',
  
  // Nombre de tu hoja y rango
  RANGE: 'Vehiculos!A:N',  // Actualizado para incluir todas las columnas nuevas
  
  // Modo de obtención de imágenes (usa la config centralizada)
  get IMAGE_MODE() { return DRIVE_CONFIG.IMAGE_MODE; },
};

/**
 * Obtiene los datos de vehículos desde Google Sheets
 */
export const fetchVehiculos = async () => {
  // Ya no necesitamos cargar carpetas al inicio
  // porque usamos directamente los IDs de carpeta
  
  try {
    // URL para obtener datos de Google Sheets en formato JSON
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${CONFIG.RANGE.split('!')[0]}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // Verificar si el contenido es válido
    if (!text || text.length < 50) {
      throw new Error('La respuesta del Sheet está vacía o es inválida');
    }
    
    // Google Sheets retorna JSONP, necesitamos extraer el JSON
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    // Verificar estructura de datos
    if (!json.table || !json.table.rows) {
      throw new Error('El formato del Sheet no es válido');
    }
    
    // Procesar los datos
    const rows = json.table.rows;
    const headers = json.table.cols.map(col => col.label || '');
    
    // Verificar que hay datos
    if (rows.length <= 1) {
      throw new Error('El Sheet no contiene datos de vehículos');
    }
    
    // Convertir filas a objetos
    const vehiculos = await Promise.all(
      rows.slice(1).map(async (row) => {
        const vehiculo = {};
        headers.forEach((header, index) => {
          const cell = row.c[index];
          vehiculo[header] = cell ? cell.v : '';
        });
        
        // Convertir tipos de datos
        vehiculo.Precio = parseFloat(vehiculo.Precio) || 0;
        vehiculo.Año = parseInt(vehiculo.Año) || 0;
        vehiculo.Kilometraje = parseInt(vehiculo.Kilometraje) || 0;
        
        // Asignar valores booleanos y strings
        vehiculo.Estado = vehiculo.Estado || '';
        vehiculo.Condicion = vehiculo.Condicion || '';
        vehiculo.Descripcion = vehiculo.Descripcion || '';
        vehiculo.Venta = vehiculo.Venta || '';
        vehiculo.Placa = vehiculo.Placa || '';
        vehiculo.Motor = vehiculo.Motor || '';
        
        // Obtener imágenes según el modo configurado
        vehiculo.imagenes = await getImagesForVehicle(vehiculo);
        
        return vehiculo;
      })
    );
    
    // Filtrar vehículos vacíos
    const vehiculosValidos = vehiculos.filter(v => v.Marca && v.Modelo);
    
    if (vehiculosValidos.length === 0) {
      throw new Error('No se encontraron vehículos válidos (verifica que tengas datos en Marca y Modelo)');
    }
    
    return vehiculosValidos;
  } catch (error) {
    // Retornar el error para que la UI lo maneje
    throw {
      message: error.message || 'Error desconocido',
      type: determineErrorType(error),
      details: error
    };
  }
};

/**
 * Obtiene las imágenes para un vehículo según el modo configurado
 */
const getImagesForVehicle = async (vehiculo) => {
  const { Placa } = vehiculo;
  
  try {
    // Buscar carpeta por placa
    const folder = await driveApiService.findFolderByPlaca(Placa);
    if (!folder) {
      console.warn(`No se encontró carpeta para la placa: ${Placa}`);
      return [];
    }
    
    // Obtener imágenes de la carpeta
    return await driveApiService.getImagesFromFolderId(folder.id);
  } catch (error) {
    console.error(`Error obteniendo imágenes para placa ${Placa}:`, error);
    return [];
  }
};

/**
 * Determina el tipo de error para mostrar mensaje apropiado
 */
const determineErrorType = (error) => {
  const message = error.message || '';
  
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'network';
  }
  if (message.includes('HTTP')) {
    return 'http';
  }
  if (message.includes('no contiene datos') || message.includes('vacía')) {
    return 'empty';
  }
  if (message.includes('formato') || message.includes('JSON')) {
    return 'format';
  }
  if (message.includes('válidos')) {
    return 'invalid_data';
  }
  
  return 'unknown';
};

/**
 * Actualiza la configuración
 */
export const updateConfig = (newConfig) => {
  Object.assign(CONFIG, newConfig);
};

/**
 * Obtiene la configuración actual
 */
export const getConfig = () => {
  return { ...CONFIG };
};

export default {
  fetchVehiculos,
  updateConfig,
  getConfig,
};
