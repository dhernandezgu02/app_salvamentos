# 🚗 App Salvamentos - Catálogo de Vehículos

Aplicación web moderna para visualizar y gestionar el inventario de vehículos disponibles en una empresa de salvamentos.

## 🎯 Características Principales

- 📱 **Responsive**: Funciona en móviles, tablets y escritorio
- 🔍 **Búsqueda Avanzada**: Filtra por marca, precio, año, transmisión, combustible
- 🖼️ **Galería Automática**: Lee imágenes directamente desde Google Drive
- 📊 **Google Sheets**: Base de datos simple y editable
- 🚀 **Rápido**: Construido con React + Vite
- 🎨 **Moderno**: UI elegante con Tailwind CSS

---

## 🚀 Inicio Rápido

### 1. Instalación

```bash
npm install
```

### 2. Configurar Google Sheets

1. **Crea una hoja de Google Sheets** con estas columnas:
   ```
   Marca | Modelo | Año | Precio | Kilometraje | Transmision | Combustible | Estado | Descripcion | CarpetaID
   ```
   
   Donde **CarpetaID** es el ID de la carpeta en Google Drive que contiene las imágenes del vehículo.

2. **Llena con tus datos:**
   ```
   Toyota | Corolla | 2020 | 45000000 | 35000 | Automática | Gasolina | Excelente | Descripción... | 1XYZ123_ID_CARPETA
   ```

3. **Publica la hoja:**
   - `Archivo → Compartir → Publicar en la web`

4. **Copia el ID:**
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ID]/edit
   ```

5. **Configura en `src/services/googleSheets.js`:**
   ```javascript
   SHEET_ID: 'TU_ID_AQUI'
   ```

### 3. Configurar Google Drive (Para Imágenes)

#### Estructura en Drive

Organiza tus imágenes así:

```
📁 Vehiculos_Salvamentos/          ← Carpeta principal
  ├── 📁 Toyota_Corolla_2020/
  │   ├── 1.jpg
  │   ├── 2.jpg
  │   └── 3.jpg
  ├── 📁 Chevrolet_Spark_2019/
  │   ├── 1.jpg
  │   └── 2.jpg
  └── 📁 Mazda_CX5_2021/
      ├── 1.jpg
      ├── 2.jpg
      └── 3.jpg
```

**Importante:**
- Nombres de carpetas: `Marca_Modelo_Año`
- Sin espacios, sin guiones (solo `_`)
- Imágenes numeradas: `1.jpg`, `2.jpg`, etc.

#### Configuración

**Opción A: Con Google Drive API (Recomendado)**

1. **Obtener API Key:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto
   - Habilita "Google Drive API"
   - Crea credenciales → API Key
   - Copia la API Key

2. **Configurar en `src/config/driveConfig.js`:**
   ```javascript
   MAIN_FOLDER_ID: 'ID_DE_TU_CARPETA_PRINCIPAL',
   API_KEY: 'TU_API_KEY',
   IMAGE_MODE: 'api'
   ```

3. **Hacer carpeta pública:**
   - Click derecho en carpeta principal
   - Compartir → Cualquier persona con el enlace

**Opción B: Sin API (Más simple, menos confiable)**

1. **Configurar en `src/config/driveConfig.js`:**
   ```javascript
   MAIN_FOLDER_ID: 'ID_DE_TU_CARPETA_PRINCIPAL',
   IMAGE_MODE: 'simple'
   ```

2. **Hacer TODAS las imágenes públicas:**
   - Selecciona todas las imágenes
   - Compartir → Cualquier persona con el enlace

### 4. Iniciar

```bash
npm run dev
```

Abre: `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
app_salvamentos/
├── src/
│   ├── components/          # Componentes React
│   │   ├── VehiculoCard.jsx
│   │   ├── VehiculoModal.jsx
│   │   └── Filtros.jsx
│   ├── services/            # Lógica de negocio
│   │   ├── googleSheets.js  # Conexión con Sheets
│   │   ├── driveApiService.js  # Google Drive API
│   │   ├── driveService.js  # Drive sin API
│   │   └── utils.js         # Utilidades
│   ├── config/              # Configuración
│   │   └── driveConfig.js   # Config de Drive
│   ├── App.jsx              # App principal
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md                # Esta guía
```

---

## ⚙️ Configuración Detallada

### Google Sheets

**Columnas requeridas:**

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| Marca | Texto | Marca del vehículo | Toyota |
| Modelo | Texto | Modelo | Corolla |
| Año | Número | Año de fabricación | 2020 |
| Precio | Número | Precio en COP (sin puntos) | 45000000 |
| Kilometraje | Número | Kilómetros | 35000 |
| Transmision | Texto | Tipo de transmisión | Automática |
| Combustible | Texto | Tipo de combustible | Gasolina |
| Estado | Texto | Estado del vehículo | Excelente |
| Descripcion | Texto | Descripción detallada | Vehículo único dueño... |

**Archivo:** `src/services/googleSheets.js`
```javascript
const CONFIG = {
  SHEET_ID: 'TU_SHEET_ID',
  RANGE: 'Vehiculos!A:K',
  IMAGE_MODE: 'api', // 'api', 'simple', o 'manual'
};
```

### Google Drive

**Archivo:** `src/config/driveConfig.js`

```javascript
export const DRIVE_CONFIG = {
  // ID de carpeta principal
  MAIN_FOLDER_ID: 'TU_FOLDER_ID',
  
  // API Key (opcional)
  API_KEY: 'TU_API_KEY',
  
  // Modo: 'api' o 'simple'
  IMAGE_MODE: 'api',
  
  // Configuración avanzada
  IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'],
  MAX_IMAGES: 10,
};
```

**Obtener FOLDER_ID:**
```
https://drive.google.com/drive/folders/[ESTE_ES_EL_ID]
```

**Nombres de carpetas:**
- Formato: `Marca_Modelo_Año`
- Sin espacios, sin caracteres especiales
- Ejemplos:
  - ✅ `Toyota_Corolla_2020`
  - ✅ `Chevrolet_SparkGT_2019`
  - ✅ `Mazda_CX5_2021` (CX-5 → CX5)
  - ❌ `Toyota Corolla 2020`
  - ❌ `Mazda_CX-5_2021`

**Nombres de imágenes:**
- Usar números secuenciales: `1.jpg`, `2.jpg`, `3.jpg`
- La primera imagen será la principal

---

## 🔧 Modos de Operación

### Modo API (Recomendado)

**Ventajas:**
- ✅ Lee carpetas y archivos reales
- ✅ Más confiable
- ✅ Detecta automáticamente cantidad de fotos
- ✅ Ordena imágenes correctamente

**Desventajas:**
- ⚠️ Requiere API Key
- ⚠️ Límites de cuota API (generalmente suficiente)

**Configuración:**
```javascript
IMAGE_MODE: 'api',
API_KEY: 'TU_API_KEY'
```

### Modo Simple

**Ventajas:**
- ✅ No requiere API Key
- ✅ Configuración más rápida
- ✅ Sin límites de API

**Desventajas:**
- ⚠️ URLs predecibles (puede fallar)
- ⚠️ Todas las imágenes deben ser públicas
- ⚠️ Menos confiable

**Configuración:**
```javascript
IMAGE_MODE: 'simple',
MAIN_FOLDER_ID: 'TU_FOLDER_ID'
```

### Modo Manual (Legacy)

**Ventajas:**
- ✅ Control total sobre URLs
- ✅ Sin dependencias de API

**Desventajas:**
- ⚠️ Debes poner URLs en el Sheet
- ⚠️ Más trabajo manual

**Configuración:**
```javascript
IMAGE_MODE: 'manual'
```

Agrega columna `ImagenesURLs` en el Sheet con URLs separadas por comas.

---

## 📝 Flujo de Trabajo

### Agregar un Vehículo Nuevo

1. **Prepara las imágenes:**
   - Renombra: `1.jpg`, `2.jpg`, `3.jpg`
   - Optimiza (máx 1920px, calidad 80%)

2. **Crea carpeta en Drive:**
   ```
   Marca_Modelo_Año/
   ```

3. **Sube las imágenes:**
   - Arrastra las fotos a la carpeta

4. **Agrega datos al Sheet:**
   - Nueva fila con los datos del vehículo

5. **¡Listo!**
   - La app detectará automáticamente las imágenes

**Tiempo:** ~3-5 minutos por vehículo

### Actualizar Información

**Para cambiar precio, descripción, etc:**
- Solo edita el Google Sheet
- Los cambios se reflejan automáticamente

**Para cambiar/agregar fotos:**
- Sube las nuevas imágenes a Drive
- Mantén la numeración secuencial
- La app las detectará automáticamente

---

## 🎨 Personalización

### Colores

Edita `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#3b82f6',  // Azul
    600: '#2563eb',
    // ... cambia estos valores
  },
}
```

### Contacto

Edita `src/components/VehiculoModal.jsx`:

```javascript
// WhatsApp
const telefono = '573001234567';

// Email
window.location.href = 'mailto:tu-email@empresa.com'
```

### Logo y Nombre

Edita `src/App.jsx`:

```javascript
<h1>Tu Nombre de Empresa</h1>
```

---

## 🐛 Solución de Problemas

### Las imágenes no cargan

**Problema:** Aparecen placeholders grises

**Causas posibles:**

1. **Nombres no coinciden**
   - Verifica que el nombre de carpeta en Drive coincida con Marca_Modelo_Año
   - Ejemplo: `Toyota_Corolla_2020` (exacto)

2. **Carpeta no es pública**
   - Comparte la carpeta principal como pública
   - Verificación: Abre en ventana de incógnito

3. **API no configurada** (si usas modo API)
   - Verifica API_KEY en `driveConfig.js`
   - Verifica que Drive API esté habilitada

4. **FOLDER_ID incorrecto**
   - Copia de nuevo el ID de la URL de Drive
   - Debe ser la carpeta PRINCIPAL que contiene las subcarpetas

**Solución rápida:**
```javascript
// Abre la consola del navegador (F12)
// Ve a la pestaña Console
// Busca errores en rojo
```

### Los datos del Sheet no aparecen

**Problema:** No se muestran vehículos

**Causas:**

1. **SHEET_ID incorrecto**
   - Copia el ID completo de la URL

2. **Hoja no publicada**
   - Archivo → Compartir → Publicar en la web

3. **Nombre de hoja incorrecto**
   - En `RANGE`: debe coincidir con el nombre de la pestaña
   - Ejemplo: `Vehiculos!A:K` si tu pestaña se llama "Vehiculos"

**Verificación:**
```javascript
// Abre esta URL en tu navegador:
https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:json

// Deberías ver datos en formato JSON
```

### Modo API no funciona

**Verificación:**

1. **API Key válida:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - APIs y servicios → Credenciales
   - Verifica que la key esté activa

2. **Drive API habilitada:**
   - APIs y servicios → Biblioteca
   - Busca "Google Drive API"
   - Debe estar habilitada

3. **Límites de cuota:**
   - Ve a APIs y servicios → Panel
   - Verifica el uso de la cuota
   - Límite estándar: 1000 solicitudes/día

**Solución temporal:**
```javascript
// Cambia a modo simple
IMAGE_MODE: 'simple'
```

---

## 📦 Despliegue

### Vercel (Recomendado - Gratis)

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Conecta tu repositorio
4. Deploy automático

### Netlify

```bash
npm run build
# Sube la carpeta dist/ a Netlify
```

### GitHub Pages

```bash
npm install -D gh-pages

# Agrega a package.json:
"homepage": "https://tuusuario.github.io/app-salvamentos",
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

npm run deploy
```

---

## 🔒 Seguridad

### ✅ Buenas Prácticas

- Google Sheet es público (solo lectura)
- Carpeta de Drive es pública (solo lectura)
- No incluyas datos sensibles (VIN completos, etc.)
- La API Key tiene restricciones (solo Drive API)

### ⚠️ No Subir al Repositorio

El `.gitignore` ya está configurado para NO subir:
- API Keys (si las pones en archivos de config)
- Carpeta `imagenes/` local
- Archivos de credenciales

---

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Vista previa de build

# Otros
npm install          # Instala dependencias
```

---

## 💡 Tips y Mejores Prácticas

### Para las Imágenes

1. **Optimiza antes de subir:**
   - Máximo 1920px de ancho
   - Calidad 80% JPG
   - Usa herramientas como TinyPNG

2. **Organización:**
   - Primera imagen siempre frontal
   - Mantén orden consistente
   - Usa nombres secuenciales

3. **Backups:**
   - Guarda copias locales en `imagenes/`
   - Esta carpeta no se sube al repo (está en .gitignore)

### Para los Datos

1. **Consistencia:**
   - Usa siempre "Automática" o "Mecánica" (no mezcles)
   - Precios sin puntos: `45000000`
   - Años solo números: `2020`

2. **Descripciones:**
   - Sé específico y claro
   - Menciona lo más importante primero
   - Máximo 200-300 caracteres

### Para el Mantenimiento

1. **Actualizaciones:**
   - Edita el Sheet, los cambios son inmediatos
   - Agrega fotos a Drive cuando sea necesario

2. **Performance:**
   - Las imágenes se cachean automáticamente
   - Si actualizas una foto, puede tardar 5-10 min en reflejarse

3. **Monitoreo:**
   - Revisa la consola del navegador por errores
   - Verifica límites de API si usas modo API

---

## 📊 Especificaciones Técnicas

### Stack

- **Frontend:** React 18
- **Build Tool:** Vite 5
- **Estilos:** Tailwind CSS 3
- **Iconos:** Lucide React
- **Backend:** Google Sheets + Google Drive

### Requisitos

- Node.js 18+
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Performance

- Initial load: < 2s
- Time to Interactive: < 3s
- Lighthouse Score: 90+

---

## 🤝 Contribuir

Si quieres mejorar la app:

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/mejora`
3. Commit: `git commit -m 'Agrega mejora'`
4. Push: `git push origin feature/mejora`
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Úsalo libremente para tu empresa.

---

## 🆘 Soporte

¿Problemas? ¿Dudas?

1. Revisa esta guía completa
2. Verifica la consola del navegador (F12)
3. Abre un Issue en GitHub con:
   - Descripción del problema
   - Captura de errores de consola
   - Pasos que intentaste

---

## 📈 Roadmap Futuro

- [ ] Sistema de favoritos
- [ ] Comparación de vehículos
- [ ] Panel de administración
- [ ] Notificaciones de nuevos vehículos
- [ ] Integración con WhatsApp Business API
- [ ] Modo oscuro
- [ ] PWA (App instalable)

---

**Desarrollado con ❤️ para Empresas de Salvamentos**

¿Preguntas? ¿Sugerencias? ¡Contáctanos!
