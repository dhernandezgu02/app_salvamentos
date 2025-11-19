import React from 'react';
import { Car, Wrench, Shield } from 'lucide-react';

const CustomSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="text-center">
        {/* Logo principal animado */}
        <div className="relative mb-6">
          {/* Círculo exterior giratorio */}
          <div className="w-24 h-24 mx-auto relative">
            {/* Anillo exterior */}
            <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-orange-500 border-r-orange-400 animate-spin"></div>
            
            {/* Anillo intermedio */}
            <div className="absolute inset-1 rounded-full border-3 border-transparent border-b-blue-500 border-l-blue-400 animate-spin-reverse"></div>
            
            {/* Logo central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-full shadow-2xl">
                <Car className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Iconos orbitales más pequeños */}
            <div className="absolute inset-0">
              {/* Icono 1 - Llave */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                  <Wrench className="w-2 h-2 text-white" />
                </div>
              </div>
              
              {/* Icono 2 - Escudo */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-bounce delay-75">
                  <Shield className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Título más compacto */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Salvamentos Automotor
          </h2>
        </div>
        
        {/* Mensaje de carga */}
        <div className="space-y-3">
          <p className="text-lg font-medium text-white">{message}</p>
          
          {/* Puntos de carga animados */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
        
        {/* Barra de progreso más pequeña */}
        <div className="mt-6 w-64 mx-auto">
          <div className="h-1 bg-gray-700 bg-opacity-50 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer"></div>
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSpinner;