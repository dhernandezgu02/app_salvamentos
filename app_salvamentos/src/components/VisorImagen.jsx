import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

const VisorImagen = ({ vehiculo, imagenInicial = 0, onClose }) => {
  const [imagenActual, setImagenActual] = useState(imagenInicial);
  const [imagenAmpliada, setImagenAmpliada] = useState(false);
  const [pantallaCompleta, setPantallaCompleta] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  
  if (!vehiculo || !vehiculo.imagenes || vehiculo.imagenes.length === 0) {
    console.error('Error: Vehículo sin imágenes en el visor');
    return null;
  }

  const handleImagenAnterior = () => {
    setImagenActual((prev) => 
      prev === 0 ? vehiculo.imagenes.length - 1 : prev - 1
    );
    setCargando(true);
  };

  const handleImagenSiguiente = () => {
    setImagenActual((prev) => 
      prev === vehiculo.imagenes.length - 1 ? 0 : prev + 1
    );
    setCargando(true);
  };
  
  const toggleImagenAmpliada = () => {
    setImagenAmpliada(!imagenAmpliada);
    setCargando(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Contenedor principal de la imagen */}
      <div className="w-full h-full flex items-center justify-center">
        {cargando && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Vista de imagen según el modo */}
        <iframe
          key={`visor-${vehiculo.Placa}-${imagenActual}`}
          src={vehiculo.imagenes[imagenActual].preview}
          className={`w-full h-full border-0 ${imagenAmpliada ? 'scale-100' : 'scale-90'}`}
          allow="autoplay"
          loading="lazy"
          onLoad={() => setCargando(false)}
        ></iframe>
        

        {/* Mensaje de error */}
        {errorCarga && !cargando && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center p-4 bg-black/50 rounded-lg">
              <p className="text-xl mb-2">Error al cargar la imagen</p>
              <button 
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded"
                onClick={() => {
                  setCargando(true);
                  setErrorCarga(false);
                }}
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>
      
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
          title={imagenAmpliada ? "Ver en visor" : "Ver imagen completa"}
        >
          {imagenAmpliada ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
        </button>
        <button 
          onClick={onClose}
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          title="Cerrar"
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
};

export default VisorImagen;