# ⚡ Inicio Rápido - 5 Minutos

Esta guía te ayuda a poner la app funcionando **inmediatamente**.

---

## 📋 Checklist de Configuración

### ✅ Paso 1: Instalar (30 segundos)

```bash
npm install
```

### ✅ Paso 2: Google Sheets (2 minutos)

1. **Crear hoja con estas columnas:**
   ```
   Marca | Modelo | Año | Precio | Kilometraje | Transmision | Combustible | Estado | Descripcion
   ```

2. **Agregar datos de prueba:**
   ```
   Toyota | Corolla | 2020 | 45000000 | 35000 | Automática | Gasolina | Excelente | Vehículo...
   ```

3. **Publicar:**
   - `Archivo → Compartir → Publicar en la web`

4. **Copiar ID:**
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ID]/edit
   ```

5. **Configurar** en `src/services/googleSheets.js`:
   ```javascript
   SHEET_ID: 'TU_ID_AQUI'
   ```

### ✅ Paso 3: Google Drive (2 minutos)

1. **Crear estructura en Drive:**
   ```
   📁 Vehiculos_Salvamentos/
     └── 📁 Toyota_Corolla_2020/
         ├── 1.jpg
         └── 2.jpg
   ```

2. **Hacer pública la carpeta principal**

3. **Copiar ID de carpeta:**
   ```
   https://drive.google.com/drive/folders/[ESTE_ID]
   ```

4. **Configurar:**
   
   Opción A - Con API Key (recomendado):
   ```javascript
   // src/config/driveConfig.js
   MAIN_FOLDER_ID: 'TU_ID',
   API_KEY: 'TU_API_KEY',
   IMAGE_MODE: 'api'
   ```
   
   Opción B - Sin API Key (más simple):
   ```javascript
   // src/config/driveConfig.js
   MAIN_FOLDER_ID: 'TU_ID',
   IMAGE_MODE: 'simple'
   ```

### ✅ Paso 4: Iniciar (1 segundo)

```bash
npm run dev
```

Abre: `http://localhost:5173`

---

## 🎯 Si algo no funciona

### No aparecen los datos del Sheet

```javascript
// Verifica en src/services/googleSheets.js:
SHEET_ID: 'correcto?'
RANGE: 'Vehiculos!A:K'  // ¿Coincide con el nombre de tu pestaña?
```

### No aparecen las imágenes

**Opción 1:** Usa modo simple (sin API)
```javascript
// src/config/driveConfig.js
IMAGE_MODE: 'simple'
```

**Opción 2:** Verifica la configuración API
- ¿API Key válida?
- ¿Drive API habilitada en Google Cloud Console?
- ¿Carpeta pública?

---

## 📝 Convenciones Importantes

### Nombres de Carpetas en Drive

**Formato:** `Marca_Modelo_Año`

**Ejemplos correctos:**
- ✅ `Toyota_Corolla_2020`
- ✅ `Chevrolet_SparkGT_2019`
- ✅ `Mazda_CX5_2021`

**Ejemplos incorrectos:**
- ❌ `Toyota Corolla 2020` (espacios)
- ❌ `Mazda_CX-5_2021` (guión)

### Nombres de Imágenes

**Usar números secuenciales:**
- `1.jpg` (imagen principal)
- `2.jpg`
- `3.jpg`

---

## 🚀 Siguiente Paso

Lee el **README.md** completo para:
- Configuración avanzada
- Personalización
- Solución de problemas
- Despliegue

---

**¿Listo? ¡Ejecuta `npm run dev` y empieza! 🎉**

