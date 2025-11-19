import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const Filtros = ({ filtros, onFiltrosChange, marcas }) => {
  const handleChange = (campo, valor) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      busqueda: '',
      marca: '',
      precioMin: '',
      precioMax: '',
      añoMin: '',
      añoMax: '',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900">Filtros de Búsqueda</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Búsqueda general */}
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Búsqueda
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filtros.busqueda}
              onChange={(e) => handleChange('busqueda', e.target.value)}
              placeholder="Buscar por marca, modelo, año..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca
          </label>
          <select
            value={filtros.marca}
            onChange={(e) => handleChange('marca', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            {marcas.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Mínimo
          </label>
          <input
            type="number"
            value={filtros.precioMin}
            onChange={(e) => handleChange('precioMin', e.target.value)}
            placeholder="$0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Máximo
          </label>
          <input
            type="number"
            value={filtros.precioMax}
            onChange={(e) => handleChange('precioMax', e.target.value)}
            placeholder="$999,999,999"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Año mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año Desde
          </label>
          <input
            type="number"
            value={filtros.añoMin}
            onChange={(e) => handleChange('añoMin', e.target.value)}
            placeholder="2000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Año máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año Hasta
          </label>
          <input
            type="number"
            value={filtros.añoMax}
            onChange={(e) => handleChange('añoMax', e.target.value)}
            placeholder="2025"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Botón limpiar filtros */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={limpiarFiltros}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default Filtros;

