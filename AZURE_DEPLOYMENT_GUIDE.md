# 🚀 GUÍA DE DESPLIEGUE AZURE - PROTEIA PLATFORM

## 📋 **Preparación Previa**

### **1. Requisitos**
- ✅ Cuenta de Azure (Free tier disponible)
- ✅ Azure CLI instalado
- ✅ Git repository (GitHub recomendado)
- ✅ Visual Studio Code con extensiones Azure

### **2. Estructura de Archivos Necesarios**

```
proteia-3tier/
├── 📁 proteia-frontend/
│   ├── 📄 package.json
│   ├── 📄 staticwebapp.config.json  ← CREAR
│   └── 📁 dist/ (build output)
├── 📁 proteia-backend/
│   ├── 📄 Proteia.API.csproj
│   ├── 📄 web.config              ← CREAR
│   └── 📄 appsettings.Production.json ← CREAR
└── 📁 deployment/
    ├── 📄 azure-pipelines.yml     ← CREAR
    └── 📄 docker-compose.yml      ← CREAR (opcional)
```

---

## 🎯 **OPCIÓN 1: DESPLIEGUE BÁSICO (Recomendado)**

### **Costo Estimado: $18/mes**

#### **Paso 1: Configurar Frontend (Azure Static Web Apps)**

1. **Crear configuración para Static Web Apps:**

```json
// staticwebapp.config.json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "mimeTypes": {
    ".json": "application/json",
    ".js": "application/javascript",
    ".css": "text/css"
  },
  "globalHeaders": {
    "Cache-Control": "public, max-age=31536000, immutable"
  }
}
```

2. **Comandos de despliegue:**

```bash
# Instalar Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login a Azure
az login

# Crear resource group
az group create --name proteia-rg --location "East US"

# Crear Static Web App
az staticwebapp create \
  --name proteia-frontend \
  --resource-group proteia-rg \
  --source https://github.com/tu-usuario/proteia-3tier \
  --location "East US2" \
  --branch main \
  --app-location "/proteia-frontend" \
  --build-location "dist"
```

#### **Paso 2: Configurar Backend (Azure App Service)**

1. **Crear archivo de configuración de producción:**

```json
// appsettings.Production.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:proteia-sql-server.database.windows.net,1433;Initial Catalog=proteia-db;Persist Security Info=False;User ID=proteia-admin;Password={password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Cors": {
    "Origins": ["https://proteia-frontend.azurestaticapps.net"]
  },
  "JWT": {
    "SecretKey": "{your-production-secret-key}",
    "Issuer": "https://proteia-api.azurewebsites.net",
    "Audience": "https://proteia-frontend.azurestaticapps.net",
    "ExpiryInHours": 8
  }
}
```

2. **Comandos de despliegue del backend:**

```bash
# Crear App Service Plan
az appservice plan create \
  --name proteia-plan \
  --resource-group proteia-rg \
  --sku B1 \
  --is-linux

# Crear Web App
az webapp create \
  --resource-group proteia-rg \
  --plan proteia-plan \
  --name proteia-api \
  --runtime "DOTNETCORE:8.0"

# Configurar variables de entorno
az webapp config appsettings set \
  --resource-group proteia-rg \
  --name proteia-api \
  --settings ASPNETCORE_ENVIRONMENT=Production

# Deploy desde código local
cd proteia-backend
az webapp up --name proteia-api --resource-group proteia-rg
```

#### **Paso 3: Configurar Base de Datos (Azure SQL)**

```bash
# Crear SQL Server
az sql server create \
  --name proteia-sql-server \
  --resource-group proteia-rg \
  --location "East US" \
  --admin-user proteia-admin \
  --admin-password "ProteiaSecure123!"

# Crear base de datos
az sql db create \
  --resource-group proteia-rg \
  --server proteia-sql-server \
  --name proteia-db \
  --service-objective Basic

# Configurar firewall para Azure services
az sql server firewall-rule create \
  --resource-group proteia-rg \
  --server proteia-sql-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

---

## 🏢 **OPCIÓN 2: DESPLIEGUE EMPRESARIAL**

### **Costo Estimado: $108-118/mes**

#### **Características Adicionales:**
- Auto-scaling avanzado
- Multiple environments (dev, staging, prod)
- Application Insights
- Azure Key Vault para secrets
- Private endpoints
- CDN premium

#### **Comandos Empresariales:**

```bash
# Crear App Service Plan Premium
az appservice plan create \
  --name proteia-premium-plan \
  --resource-group proteia-rg \
  --sku P1V3 \
  --is-linux

# Crear Key Vault para secrets
az keyvault create \
  --name proteia-keyvault \
  --resource-group proteia-rg \
  --location "East US"

# Crear Application Insights
az monitor app-insights component create \
  --app proteia-insights \
  --location "East US" \
  --resource-group proteia-rg
```

---

## 🐳 **OPCIÓN 3: DESPLIEGUE CONTAINERIZADO**

### **Costo Estimado: $20-40/mes**

#### **Dockerfile para Frontend:**

```dockerfile
# proteia-frontend/Dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **Dockerfile para Backend:**

```dockerfile
# proteia-backend/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Proteia.API.csproj", "."]
RUN dotnet restore "Proteia.API.csproj"

COPY . .
WORKDIR "/src"
RUN dotnet build "Proteia.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Proteia.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Proteia.API.dll"]
```

#### **Despliegue con Container Apps:**

```bash
# Crear Container Apps Environment
az containerapp env create \
  --name proteia-env \
  --resource-group proteia-rg \
  --location "East US"

# Deploy Frontend Container
az containerapp create \
  --name proteia-frontend \
  --resource-group proteia-rg \
  --environment proteia-env \
  --image your-registry/proteia-frontend:latest \
  --target-port 80 \
  --ingress external

# Deploy Backend Container
az containerapp create \
  --name proteia-backend \
  --resource-group proteia-rg \
  --environment proteia-env \
  --image your-registry/proteia-backend:latest \
  --target-port 80 \
  --ingress external
```

---

## 🔧 **Configuración de CI/CD**

### **GitHub Actions para Despliegue Automático:**

```yaml
# .github/workflows/azure-deploy.yml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install and Build
      run: |
        cd proteia-frontend
        npm ci
        npm run build
        
    - name: Deploy to Static Web Apps
      uses: Azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        action: "upload"
        app_location: "/proteia-frontend"
        output_location: "dist"

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '8.0.x'
        
    - name: Build and Deploy
      run: |
        cd proteia-backend
        dotnet publish -c Release -o ./publish
        
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'proteia-api'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: './proteia-backend/publish'
```

---

## 📊 **Comparación de Opciones**

| Característica | Básico | Empresarial | Containerizado |
|----------------|--------|-------------|----------------|
| **Costo/mes** | $18 | $108-118 | $20-40 |
| **Escalabilidad** | Básica | Avanzada | Automática |
| **Mantenimiento** | Bajo | Medio | Bajo |
| **Performance** | Bueno | Excelente | Muy Bueno |
| **Flexibilidad** | Limitada | Alta | Muy Alta |
| **Tiempo Setup** | 2-3 horas | 1-2 días | 4-6 horas |

---

## 🎯 **Recomendación Final**

### **Para Empezar: OPCIÓN 1 (Básico)**
- ✅ Costo muy bajo ($18/mes)
- ✅ Fácil de configurar
- ✅ Escalable cuando necesites
- ✅ Perfecto para MVP y pruebas

### **Para Producción: OPCIÓN 3 (Containerizado)**
- ✅ Mejor relación costo-beneficio
- ✅ Muy escalable
- ✅ Fácil mantenimiento
- ✅ Preparado para el futuro

### **Para Enterprise: OPCIÓN 2 (Empresarial)**
- ✅ Máximo rendimiento
- ✅ SLA garantizado
- ✅ Características avanzadas
- ✅ Soporte premium

---

## 🚀 **Próximos Pasos**

1. **Elige tu opción** basada en presupuesto y necesidades
2. **Crea cuenta de Azure** (free tier disponible)
3. **Configura GitHub repository** con tu código
4. **Sigue los comandos** de la opción elegida
5. **Configura CI/CD** para deploys automáticos

**¿Quieres que te ayude a implementar alguna de estas opciones específicamente?**
