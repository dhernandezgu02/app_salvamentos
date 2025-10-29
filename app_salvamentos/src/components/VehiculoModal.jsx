import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Phone, Mail, MapPin, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

const VehiculoModal = ({ vehiculo, onClose }) => {
  const [imagenActual, setImagenActual] = useState(0);
  const [imagenAmpliada, setImagenAmpliada] = useState(false);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  if (!vehiculo) return null;

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
  
  const toggleImagenAmpliada = () => {
    setImagenAmpliada(!imagenAmpliada);
  };
  
  const togglePantallaCompleta = () => {
    setPantallaCompleta(!pantallaCompleta);
  };

  const handleWhatsApp = () => {
    const mensaje = `Hola, estoy interesado en el vehículo:
- Marca: ${vehiculo.Marca}
- Modelo: ${vehiculo.Modelo}
- Año: ${vehiculo.Año}
- Placa: ${vehiculo.Placa}
- Motor: ${vehiculo.Motor}
- Estado: ${vehiculo.Estado}
- Condición: ${vehiculo.Condicion}`;
    const telefono = '573134433051'; 
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  // Si está en pantalla completa, mostrar solo la imagen
  if (pantallaCompleta) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* Imagen en pantalla completa */}
        <img
          src={vehiculo.imagenes[imagenActual]}
          alt={`${vehiculo.Marca} ${vehiculo.Modelo}`}
          className={`max-h-screen max-w-screen ${imagenAmpliada ? 'object-cover' : 'object-contain'}`}
          onClick={toggleImagenAmpliada}
        />
        
        {/* Controles de navegación */}
        {vehiculo.imagenes.length > 1 && (
          <>
            <button
              onClick={handleImagenAnterior}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleImagenSiguiente}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Botones de control */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={toggleImagenAmpliada}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            {imagenAmpliada ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button 
            onClick={togglePantallaCompleta}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <Minimize className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Contador de imágenes */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
          <span className="text-white text-sm font-medium">
            {imagenActual + 1} / {vehiculo.imagenes.length}
          </span>
        </div>
      </div>
    );
  }
  
  // Vista normal del modal
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              onClick={onClose}
              className="bg-white rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Galería de imágenes */}
          <div className="relative h-96 bg-gray-900">
            {vehiculo.imagenes && vehiculo.imagenes.length > 0 ? (
              <>
                <div className="relative w-full h-full">
                  <iframe
                    src={vehiculo.imagenes[imagenActual].preview}
                    className="w-full h-full border-0"
                    allow="autoplay"
                    loading="lazy"
                  />
                  {/* Controles de navegación */}
                  {vehiculo.imagenes.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      <button
                        onClick={() => setImagenActual((prev) => (prev === 0 ? vehiculo.imagenes.length - 1 : prev - 1))}
                        className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        ←
                      </button>
                      <span className="bg-black/50 text-white px-4 py-2 rounded-full">
                        {imagenActual + 1} / {vehiculo.imagenes.length}
                      </span>
                      <button
                        onClick={() => setImagenActual((prev) => (prev === vehiculo.imagenes.length - 1 ? 0 : prev + 1))}
                        className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Botones de control */}
                <div className="absolute top-4 right-16 flex gap-2">
                  <button 
                    onClick={toggleImagenAmpliada}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    {imagenAmpliada ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={togglePantallaCompleta}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
                
                {vehiculo.imagenes.length > 1 && (
                  <>
                    <button
                      onClick={handleImagenAnterior}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleImagenSiguiente}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
                      <span className="text-white text-sm font-medium">
                        {imagenActual + 1} / {vehiculo.imagenes.length}
                      </span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Sin imágenes disponibles</span>
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="px-6 py-6">
            <div className="sm:flex sm:items-start sm:justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {vehiculo.Marca} {vehiculo.Modelo}
                </h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {vehiculo.Estado}
                  </span>
                  <span className="text-gray-500">Año {vehiculo.Año}</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="text-4xl font-bold text-primary-600">
                  {formatPrecio(vehiculo.Precio)}
                </p>
              </div>
            </div>

            {/* Especificaciones */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Kilometraje</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatKilometraje(vehiculo.Kilometraje)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Transmisión</p>
                <p className="text-lg font-semibold text-gray-900">
                  {vehiculo.Transmision}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Combustible</p>
                <p className="text-lg font-semibold text-gray-900">
                  {vehiculo.Combustible}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Marca</p>
                <p className="text-lg font-semibold text-gray-900">
                  {vehiculo.Marca}
                </p>
              </div>
            </div>

            {/* Descripción */}
            {vehiculo.Descripcion && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Descripción
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {vehiculo.Descripcion}
                </p>
              </div>
            )}

            {/* Botón de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Contactar por WhatsApp
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Disponible para inspección en nuestras instalaciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiculoModal;

