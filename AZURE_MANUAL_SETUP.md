# 🔧 CONFIGURACIÓN MANUAL DE AZURE - PROTEIA

## ✅ **COMPONENTES CREADOS EN AZURE PORTAL**

Después de crear los componentes en Azure Portal, necesitas configurar estos archivos:

---

## 📝 **PASO 1: ACTUALIZAR CONFIGURACIÓN DEL BACKEND**

### **1.1 Editar appsettings.Production.json:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "TU_CONNECTION_STRING_AQUI"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Cors": {
    "Origins": [
      "https://TU-FRONTEND-URL.azurestaticapps.net",
      "http://localhost:3000"
    ]
  },
  "JWT": {
    "SecretKey": "ProteiaJWTSecretKey2025VerySecureAndLongEnoughForProduction!",
    "Issuer": "https://TU-BACKEND-URL.azurewebsites.net",
    "Audience": "https://TU-FRONTEND-URL.azurestaticapps.net",
    "ExpiryInHours": 8
  }
}
```

**Reemplaza:**
- `TU_CONNECTION_STRING_AQUI` → Tu connection string real
- `TU-FRONTEND-URL` → URL de tu Static Web App
- `TU-BACKEND-URL` → URL de tu App Service

---

## 🚀 **PASO 2: DESPLEGAR EL BACKEND**

### **Opción A: Desde Visual Studio Code (RECOMENDADO)**

1. **Instalar extensión Azure App Service:**
   - Abrir VS Code
   - Ir a Extensions
   - Buscar "Azure App Service"
   - Instalar

2. **Desplegar:**
   - Abrir carpeta `proteia-backend` en VS Code
   - Clic derecho en la carpeta
   - "Deploy to Web App..."
   - Seleccionar tu App Service "proteia-api"

### **Opción B: Desde Azure CLI**

```bash
# Navegar al backend
cd proteia-backend

# Build y publish
dotnet publish -c Release -o ./publish

# Comprimir archivos
zip -r deploy.zip ./publish/*

# Desplegar a Azure
az webapp deployment source config-zip \
  --resource-group proteia-rg \
  --name proteia-api \
  --src deploy.zip
```

### **Opción C: Desde Azure Portal (Deployment Center)**

1. **Ir a tu App Service** → "Deployment Center"
2. **Seleccionar "Local Git"** o **"GitHub"**
3. **Seguir las instrucciones** para conectar tu repositorio

---

## 🎨 **PASO 3: DESPLEGAR EL FRONTEND**

### **Opción A: Desde Azure Portal (RECOMENDADO)**

1. **Ir a tu Static Web App** → "Overview"
2. **Clic en "Manage deployment token"**
3. **Copiar el token**

4. **En tu proyecto local:**
```bash
# Instalar Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Navegar al frontend
cd proteia-frontend

# Build del proyecto
npm run build

# Desplegar
swa deploy ./dist --deployment-token="TU_TOKEN_AQUI"
```

### **Opción B: Conectar con GitHub**

1. **Ir a tu Static Web App** → "Overview"
2. **Clic en "Manage deployment token"** 
3. **Conectar con GitHub repository**
4. **Configurar build settings:**
   ```
   App location: /proteia-frontend
   Output location: dist
   ```

---

## 🔗 **PASO 4: CONFIGURAR API ENDPOINTS EN FRONTEND**

### **4.1 Crear archivo de configuración:**

Crear `proteia-frontend/src/config/api.ts`:

```typescript
// Configuración de API para producción
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5018'
  },
  production: {
    baseURL: 'https://TU-BACKEND-URL.azurewebsites.net'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = API_CONFIG[environment as keyof typeof API_CONFIG].baseURL;

// Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh'
  },
  products: {
    list: '/api/products',
    details: '/api/products'
  },
  dashboard: {
    overview: '/api/dashboard/overview',
    analytics: '/api/dashboard/analytics'
  }
};
```

### **4.2 Actualizar servicios para usar la configuración:**

En tus archivos de servicio, reemplaza las URLs hardcodeadas:

```typescript
// Antes
const response = await fetch('http://localhost:5018/api/auth/login', {

// Después  
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
```

---

## ✅ **PASO 5: VERIFICAR DESPLIEGUE**

### **5.1 Verificar Backend:**
```bash
# Verificar que el backend responde
curl https://TU-BACKEND-URL.azurewebsites.net/api/health

# O abrir en navegador
https://TU-BACKEND-URL.azurewebsites.net
```

### **5.2 Verificar Frontend:**
```bash
# Verificar que el frontend carga
curl -I https://TU-FRONTEND-URL.azurestaticapps.net

# O abrir en navegador
https://TU-FRONTEND-URL.azurestaticapps.net
```

### **5.3 Verificar Conexión BD:**
1. **Ir a App Service** → "Log stream"
2. **Verificar logs** de conexión a base de datos
3. **Si hay errores**, revisar connection string y firewall

---

## 🔧 **TROUBLESHOOTING COMÚN**

### **Error: "Cannot connect to database"**
- Verificar firewall de SQL Server permite conexiones de Azure
- Verificar connection string en Configuration
- Verificar credenciales de BD

### **Error: "CORS policy"**
- Agregar URL del frontend en CORS del backend
- Verificar que las URLs no tengan "/" al final

### **Error: "404 Not Found" en Static Web App**
- Verificar que `staticwebapp.config.json` está en la raíz
- Verificar build output location es "dist"

### **Error: "500 Internal Server Error"**
- Revisar logs en App Service → "Log stream"
- Verificar variables de entorno
- Verificar que .NET 8 runtime está seleccionado

---

## 📊 **RESUMEN DE URLs**

Después del despliegue tendrás:

```
🎨 Frontend: https://TU-FRONTEND-URL.azurestaticapps.net
🔧 Backend:  https://TU-BACKEND-URL.azurewebsites.net  
🗄️ Database: TU-SERVIDOR.database.windows.net
```

---

## 💡 **PRÓXIMOS PASOS**

1. **✅ Crear componentes en Azure Portal**
2. **✅ Configurar variables de entorno**
3. **✅ Actualizar archivos de configuración**
4. **✅ Desplegar backend y frontend**
5. **✅ Verificar que todo funciona**
6. **🔄 Configurar CI/CD** (opcional)

**¿En qué paso necesitas ayuda específica?**
