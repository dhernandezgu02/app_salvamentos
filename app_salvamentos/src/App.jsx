import React, { useState, useEffect } from 'react';
import { Car, Loader2, AlertCircle } from 'lucide-react';
import VehiculoCard from './components/VehiculoCard';
import VehiculoModal from './components/VehiculoModal';
import VisorImagen from './components/VisorImagen';
import Filtros from './components/Filtros';
import { fetchVehiculos, getConfig } from './services/googleSheets';

const CONFIG = getConfig();

function App() {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [mostrarVendidos, setMostrarVendidos] = useState(false);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    marca: '',
    precioMin: '',
    precioMax: '',
    añoMin: '',
    añoMax: '',
    transmision: '',
    combustible: '',
  });

  // Cargar vehículos al montar el componente
  useEffect(() => {
    cargarVehiculos();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros();
  }, [filtros, vehiculos, mostrarVendidos]);

  const cargarVehiculos = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await fetchVehiculos();
      setVehiculos(data);
      setVehiculosFiltrados(data);
    } catch (err) {
      // Construir mensaje de error detallado
      let errorMessage = 'Error al cargar los vehículos';
      let errorDetails = '';
      
      if (err.type) {
        switch (err.type) {
          case 'network':
            errorMessage = 'Error de Conexión';
            errorDetails = 'No se pudo conectar a Google Sheets. Verifica tu conexión a internet.';
            break;
          case 'http':
            errorMessage = 'Error de Acceso al Sheet';
            errorDetails = 'Verifica que el Sheet esté publicado y el ID sea correcto.';
            break;
          case 'empty':
            errorMessage = 'Sheet Vacío';
            errorDetails = 'El Google Sheet no contiene datos de vehículos. Agrega al menos un vehículo.';
            break;
          case 'format':
            errorMessage = 'Error de Formato';
            errorDetails = 'El formato del Sheet no es válido. Verifica que tenga las columnas correctas.';
            break;
          case 'invalid_data':
            errorMessage = 'Datos Inválidos';
            errorDetails = 'Verifica que los vehículos tengan al menos Marca y Modelo.';
            break;
          default:
            errorDetails = err.message || 'Error desconocido';
        }
      } else {
        errorDetails = err.message || 'Intenta de nuevo o verifica la configuración.';
      }
      
      setError({ title: errorMessage, message: errorDetails });
      console.error('❌ Error cargando vehículos:', err);
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = () => {
    // Filtrar según si queremos ver vendidos o disponibles
    let resultado = vehiculos.filter(v => 
      mostrarVendidos ? v.Venta === "Vendido" : v.Venta === "Disponible"
    );

    // Filtro de búsqueda general
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(
        (v) =>
          v.Marca.toLowerCase().includes(busqueda) ||
          v.Modelo.toLowerCase().includes(busqueda) ||
          v.Año.toString().includes(busqueda) ||
          (v.Descripcion && v.Descripcion.toLowerCase().includes(busqueda))
      );
    }

    // Filtro por marca
    if (filtros.marca) {
      resultado = resultado.filter((v) => v.Marca === filtros.marca);
    }

    // Filtro por precio
    if (filtros.precioMin) {
      resultado = resultado.filter((v) => v.Precio >= parseFloat(filtros.precioMin));
    }
    if (filtros.precioMax) {
      resultado = resultado.filter((v) => v.Precio <= parseFloat(filtros.precioMax));
    }

    // Filtro por año
    if (filtros.añoMin) {
      resultado = resultado.filter((v) => v.Año >= parseInt(filtros.añoMin));
    }
    if (filtros.añoMax) {
      resultado = resultado.filter((v) => v.Año <= parseInt(filtros.añoMax));
    }

    // Filtro por transmisión
    if (filtros.transmision) {
      resultado = resultado.filter((v) => v.Transmision === filtros.transmision);
    }

    // Filtro por combustible
    if (filtros.combustible) {
      resultado = resultado.filter((v) => v.Combustible === filtros.combustible);
    }

    setVehiculosFiltrados(resultado);
  };

  // Obtener valores únicos para los filtros
  const obtenerValoresUnicos = (campo) => {
    return [...new Set(vehiculos.map((v) => v[campo]))].filter(Boolean).sort();
  };

  const marcas = obtenerValoresUnicos('Marca');
  const transmisiones = obtenerValoresUnicos('Transmision');
  const combustibles = obtenerValoresUnicos('Combustible');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Salvamentos Automotor
                </h1>
                <p className="text-sm text-gray-600">
                  Vehículos disponibles para la venta
                </p>
              </div>
            </div>
            <button
              onClick={cargarVehiculos}
              className="btn-secondary flex items-center gap-2"
              disabled={cargando}
            >
              <Loader2 className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Filtros y Toggle de Vendidos */}
        <div className="space-y-4">
          <Filtros
            filtros={filtros}
            onFiltrosChange={setFiltros}
            marcas={marcas}
            transmisiones={transmisiones}
            combustibles={combustibles}
          />
          
          <div className="flex justify-end">
            <button
              onClick={() => setMostrarVendidos(!mostrarVendidos)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mostrarVendidos
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {mostrarVendidos ? 'Ver Disponibles' : 'Ver Vendidos'}
            </button>
          </div>
        </div>

        {/* Estado de carga */}
        {cargando && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando vehículos...</p>
          </div>
        )}

        {/* Error */}
        {error && !cargando && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-red-900 mb-2">
                  {error.title || 'Error'}
                </h3>
                <p className="text-red-700 mb-4 leading-relaxed">
                  {error.message || error}
                </p>
                
                {/* Información de configuración */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    🔧 Configuración Actual:
                  </p>
                  <div className="space-y-1 text-sm text-gray-600 font-mono">
                    <p>📄 Sheet ID: {CONFIG.SHEET_ID?.substring(0, 20)}...</p>
                    <p>📊 Rango: {CONFIG.RANGE}</p>
                  </div>
                </div>
                
                {/* Checklist de solución */}
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    ✅ Verifica:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• El Google Sheet está publicado en la web</li>
                    <li>• El SHEET_ID es correcto en src/services/googleSheets.js</li>
                    <li>• El nombre de la hoja coincide con RANGE (ej: "Vehiculos")</li>
                    <li>• Hay datos en el Sheet (al menos una fila con Marca y Modelo)</li>
                    <li>• Tienes conexión a internet</li>
                  </ul>
                </div>
                
                {/* Botón de reintentar */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={cargarVehiculos}
                    className="btn-primary"
                  >
                    🔄 Reintentar
                  </button>
                  <button
                    onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                    className="btn-secondary"
                  >
                    📖 Abrir Consola de Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contador de resultados */}
        {!cargando && vehiculosFiltrados.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">{vehiculosFiltrados.length}</span>{' '}
              {vehiculosFiltrados.length === 1 ? 'vehículo' : 'vehículos'}
              {vehiculosFiltrados.length !== vehiculos.length &&
                ` de ${vehiculos.length} totales`}
            </p>
          </div>
        )}

        {/* Grid de vehículos */}
        {!cargando && vehiculosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {vehiculosFiltrados.map((vehiculo, index) => (
              <VehiculoCard
                key={index}
                vehiculo={vehiculo}
                onVerDetalles={setVehiculoSeleccionado}
                onVerImagen={(vehiculo, indiceImagen) => {
                  // Crear una copia del vehículo para evitar problemas de referencia
                  const vehiculoCopia = {
                    ...vehiculo,
                    imagenes: [...(vehiculo.imagenes || [])]
                  };
                  
                  setImagenAmpliada({ 
                    vehiculo: vehiculoCopia, 
                    indiceImagen 
                  });
                }}
              />
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!cargando && vehiculosFiltrados.length === 0 && vehiculos.length > 0 && (
          <div className="text-center py-20">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron vehículos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros de búsqueda
            </p>
            <button
              onClick={() => setFiltros({
                busqueda: '',
                marca: '',
                precioMin: '',
                precioMax: '',
                añoMin: '',
                añoMax: '',
                transmision: '',
                combustible: '',
              })}
              className="btn-primary"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </main>

      {/* Modal de detalles */}
      {vehiculoSeleccionado && (
        <VehiculoModal
          vehiculo={vehiculoSeleccionado}
          onClose={() => setVehiculoSeleccionado(null)}
        />
      )}
      
      {/* Visor de imagen ampliada */}
      {imagenAmpliada && imagenAmpliada.vehiculo && imagenAmpliada.vehiculo.imagenes && (
        <VisorImagen
          key={`visor-${imagenAmpliada.vehiculo.Marca}-${imagenAmpliada.vehiculo.Modelo}`}
          vehiculo={imagenAmpliada.vehiculo}
          imagenInicial={imagenAmpliada.indiceImagen}
          onClose={() => setImagenAmpliada(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 Salvamentos Automotor. Todos los derechos reservados.</p>
          <p className="text-gray-400 text-sm">
            Para más información, contáctanos al: (601) 123-4567
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

