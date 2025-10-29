import React, { useState } from 'react';
import { Car, Gauge, Fuel, Settings, Calendar, ZoomIn } from 'lucide-react';
import DRIVE_CONFIG from '../config/driveConfig';

const VehiculoCard = ({ vehiculo, onVerDetalles, onVerImagen }) => {
  const [imagenActual, setImagenActual] = useState(0);

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const formatKilometraje = (km) => {
    return new Intl.NumberFormat('es-CO').format(km) + ' km';
  };

  const handleImagenAnterior = () => {
    setImagenActual((prev) => 
      prev === 0 ? vehiculo.imagenes.length - 1 : prev - 1
    );
  };

  const handleImagenSiguiente = () => {
    setImagenActual((prev) => 
      prev === vehiculo.imagenes.length - 1 ? 0 : prev + 1
    );
  };

  // Eliminamos logs de depuración

  return (
    <div className="card group">
      {/* Galería de imágenes */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {vehiculo.imagenes && vehiculo.imagenes.length > 0 ? (
          <>
            <div className="relative w-full h-full flex items-center justify-center">
              <iframe
                src={vehiculo.imagenes[imagenActual].preview}
                title={`${vehiculo.Marca} ${vehiculo.Modelo}`}
                className="w-full h-full border-0 overflow-hidden"
                loading="lazy"
                onError={(e) => {
                  console.error('Error cargando miniatura:', e.target.src);
                  e.target.src = 'https://placehold.co/400x300?text=Sin+Imagen';
                  // Evitar bucles de error
                  e.target.onerror = null;
                }}
              />
              
              {/* Botón para ver imagen ampliada */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onVerImagen) onVerImagen(vehiculo, imagenActual);
                }}
                className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                title="Ver imagen ampliada"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            
            {/* Controles de navegación de imágenes */}
            {vehiculo.imagenes.length > 1 && (
              <>
                <button
                  onClick={handleImagenAnterior}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleImagenSiguiente}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Indicadores de imagen */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {vehiculo.imagenes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setImagenActual(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === imagenActual ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Badges de estado y venta */}
            <div className="absolute top-2 right-2 flex gap-2">
              <span className={`text-white px-3 py-1 rounded-full text-sm font-semibold ${
                vehiculo.Estado === 'Listo' ? 'bg-blue-500' : 
                vehiculo.Estado === 'Para arreglar' ? 'bg-blue-500' : 'bg-gray-500'
              }`}>
                {vehiculo.Estado}
              </span>
              <span className={`text-white px-3 py-1 rounded-full text-sm font-semibold ${
                vehiculo.Venta === "Disponible" ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {vehiculo.Venta === "Disponible" ? "Disponible" : "Vendido"}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <Car className="w-16 h-16 text-gray-500" />
          </div>
        )}
      </div>

      {/* Información del vehículo */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-gray-900">
            {vehiculo.Marca} {vehiculo.Modelo}
          </h3>
          <p className="text-3xl font-bold text-primary-600 mt-1">
            {formatPrecio(vehiculo.Precio)}
          </p>
        </div>

        {/* Características principales */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{vehiculo.Año}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Gauge className="w-4 h-4" />
            <span className="text-sm">{formatKilometraje(vehiculo.Kilometraje)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Settings className="w-4 h-4" />
            <span className="text-sm">{vehiculo.Transmision}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Fuel className="w-4 h-4" />
            <span className="text-sm">{vehiculo.Combustible}</span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Motor: {vehiculo.Motor}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Placa: {vehiculo.Placa}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Condición: {vehiculo.Condicion}
          </span>
        </div>

        {/* Descripción */}
        {vehiculo.Descripcion && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {vehiculo.Descripcion}
          </p>
        )}

        {/* Botón de acción */}
        <button
          onClick={() => onVerDetalles(vehiculo)}
          className="w-full btn-primary"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default VehiculoCard;

