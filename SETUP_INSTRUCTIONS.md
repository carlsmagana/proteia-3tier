# 🚀 INSTRUCCIONES DE SETUP PARA DESPLIEGUE AZURE

## ✅ **ARCHIVOS CREADOS EXITOSAMENTE**

He creado todos los archivos necesarios para el despliegue:

- ✅ `staticwebapp.config.json` - Configuración del frontend
- ✅ `appsettings.Production.json` - Configuración del backend
- ✅ `deploy-azure.sh` - Script de despliegue automático
- ✅ `.github/workflows/azure-deploy.yml` - CI/CD automático
- ✅ `vite.config.ts` - Configuración de build optimizada

---

## 🔧 **PASO 1: INSTALAR HERRAMIENTAS NECESARIAS**

### **Instalar Azure CLI:**

```bash
# En macOS (usando Homebrew - RECOMENDADO)
brew install azure-cli

# O usando el instalador oficial
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### **Verificar instalación:**
```bash
az --version
```

---

## 🔐 **PASO 2: CONFIGURAR AZURE**

### **1. Crear cuenta de Azure (si no tienes):**
- Ve a: https://azure.microsoft.com/free/
- Registra una cuenta gratuita (incluye $200 de crédito)

### **2. Login desde terminal:**
```bash
az login
```
Esto abrirá tu navegador para autenticarte.

### **3. Verificar suscripción:**
```bash
az account show
```

---

## 🚀 **PASO 3: EJECUTAR DESPLIEGUE**

### **Opción A: Despliegue Automático (RECOMENDADO)**
```bash
cd /Users/carlosmagana/CascadeProjects/proteia-3tier
./deploy-azure.sh
```

### **Opción B: Despliegue Manual (paso a paso)**

#### **3.1 Crear Resource Group:**
```bash
az group create --name proteia-rg --location "East US"
```

#### **3.2 Crear SQL Database:**
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
```

#### **3.3 Crear Backend (App Service):**
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
```

#### **3.4 Crear Frontend (Static Web Apps):**
```bash
az staticwebapp create \
  --name proteia-frontend \
  --resource-group proteia-rg \
  --location "East US2"
```

---

## 📊 **PASO 4: VERIFICAR DESPLIEGUE**

Después del despliegue, tendrás estas URLs:

- **Frontend:** https://proteia-frontend.azurestaticapps.net
- **Backend:** https://proteia-api.azurewebsites.net
- **Database:** proteia-sql-server.database.windows.net

### **Verificar que funciona:**
```bash
# Verificar backend
curl https://proteia-api.azurewebsites.net/health

# Verificar frontend
curl -I https://proteia-frontend.azurestaticapps.net
```

---

## 🔄 **PASO 5: CONFIGURAR CI/CD (OPCIONAL)**

### **5.1 Crear repositorio en GitHub:**
```bash
# Si no tienes repositorio, créalo
git init
git add .
git commit -m "Initial commit for Azure deployment"
git branch -M main
git remote add origin https://github.com/tu-usuario/proteia-3tier.git
git push -u origin main
```

### **5.2 Configurar secrets en GitHub:**
Ve a tu repositorio → Settings → Secrets and variables → Actions

Agrega estos secrets:
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (obtenido de Azure Portal)
- `AZURE_WEBAPP_PUBLISH_PROFILE` (obtenido de Azure Portal)

---

## 💰 **COSTOS ESTIMADOS**

| Servicio | Plan | Costo/mes |
|----------|------|-----------|
| Azure SQL Database | Basic | $4.90 |
| App Service | B1 Basic | $13.14 |
| Static Web Apps | Free tier | $0.00 |
| **TOTAL** | | **~$18/mes** |

---

## 🆘 **TROUBLESHOOTING**

### **Error: "Azure CLI not found"**
```bash
# Instalar Azure CLI
brew install azure-cli
```

### **Error: "Login required"**
```bash
az login
```

### **Error: "Resource already exists"**
```bash
# Cambiar nombres en deploy-azure.sh
# Agregar sufijo único, ej: proteia-api-2025
```

### **Error: "SQL connection failed"**
- Verificar firewall rules en Azure Portal
- Verificar connection string en appsettings.Production.json

---

## 📞 **SIGUIENTE PASO**

**¿Estás listo para ejecutar el despliegue?**

1. **Instala Azure CLI:** `brew install azure-cli`
2. **Login a Azure:** `az login`
3. **Ejecuta el script:** `./deploy-azure.sh`

El script tardará aproximadamente **15-20 minutos** y al final tendrás tu plataforma Proteia funcionando en Azure.

**¡Avísame cuando hayas instalado Azure CLI y podemos continuar!**
