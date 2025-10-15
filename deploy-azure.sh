#!/bin/bash

# 🚀 SCRIPT DE DESPLIEGUE AZURE - PROTEIA PLATFORM
# Opción 1: Básico ($18/mes)

echo "🚀 Iniciando despliegue de Proteia en Azure..."

# Variables de configuración
RESOURCE_GROUP="proteia-rg"
LOCATION="East US"
SQL_SERVER_NAME="proteia-sql-server"
SQL_DB_NAME="proteia-db"
SQL_ADMIN_USER="proteia-admin"
SQL_ADMIN_PASSWORD="ProteiaSecure123!"
APP_SERVICE_PLAN="proteia-plan"
BACKEND_APP_NAME="proteia-api"
FRONTEND_APP_NAME="proteia-frontend"

# Verificar si Azure CLI está instalado
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI no está instalado. Instalando..."
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
fi

# Login a Azure (si no está logueado)
echo "🔐 Verificando login de Azure..."
az account show &> /dev/null || az login

# Crear Resource Group
echo "📁 Creando Resource Group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# =============================================
# 1. DESPLEGAR BASE DE DATOS
# =============================================
echo "🗄️ Desplegando Azure SQL Database..."

# Crear SQL Server
az sql server create \
  --name $SQL_SERVER_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --admin-user $SQL_ADMIN_USER \
  --admin-password $SQL_ADMIN_PASSWORD

# Crear base de datos
az sql db create \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --name $SQL_DB_NAME \
  --service-objective Basic \
  --backup-storage-redundancy Local

# Configurar firewall para Azure services
az sql server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Configurar firewall para tu IP actual
MY_IP=$(curl -s https://api.ipify.org)
az sql server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --name AllowMyIP \
  --start-ip-address $MY_IP \
  --end-ip-address $MY_IP

echo "✅ Base de datos creada: $SQL_SERVER_NAME.database.windows.net"

# =============================================
# 2. DESPLEGAR BACKEND
# =============================================
echo "🔧 Desplegando Backend (.NET 8)..."

# Crear App Service Plan
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Crear Web App
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $BACKEND_APP_NAME \
  --runtime "DOTNETCORE:8.0"

# Configurar variables de entorno
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=false

# Configurar connection string
az webapp config connection-string set \
  --resource-group $RESOURCE_GROUP \
  --name $BACKEND_APP_NAME \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:$SQL_SERVER_NAME.database.windows.net,1433;Initial Catalog=$SQL_DB_NAME;Persist Security Info=False;User ID=$SQL_ADMIN_USER;Password=$SQL_ADMIN_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

echo "✅ Backend configurado: https://$BACKEND_APP_NAME.azurewebsites.net"

# =============================================
# 3. DESPLEGAR FRONTEND
# =============================================
echo "🎨 Desplegando Frontend (React)..."

# Nota: Static Web Apps se despliega mejor desde GitHub
# Crear el recurso para configuración manual
az staticwebapp create \
  --name $FRONTEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "East US2"

echo "✅ Static Web App creada: https://$FRONTEND_APP_NAME.azurestaticapps.net"

# =============================================
# 4. MOSTRAR INFORMACIÓN DE DESPLIEGUE
# =============================================
echo ""
echo "🎉 ¡DESPLIEGUE COMPLETADO!"
echo "=================================="
echo "💰 Costo estimado: ~$18/mes"
echo ""
echo "🔗 URLs de tu aplicación:"
echo "  Frontend: https://$FRONTEND_APP_NAME.azurestaticapps.net"
echo "  Backend:  https://$BACKEND_APP_NAME.azurewebsites.net"
echo "  Database: $SQL_SERVER_NAME.database.windows.net"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Conectar GitHub repository a Static Web Apps"
echo "  2. Hacer push del código para deploy automático"
echo "  3. Migrar datos de la base de datos local"
echo "  4. Configurar dominio personalizado (opcional)"
echo ""
echo "🔧 Comandos útiles:"
echo "  Ver logs: az webapp log tail --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP"
echo "  Restart:  az webapp restart --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP"
echo ""

# Guardar información importante
cat > deployment-info.txt << EOF
PROTEIA AZURE DEPLOYMENT INFO
============================
Resource Group: $RESOURCE_GROUP
Location: $LOCATION

DATABASE:
- Server: $SQL_SERVER_NAME.database.windows.net
- Database: $SQL_DB_NAME  
- User: $SQL_ADMIN_USER
- Password: $SQL_ADMIN_PASSWORD

BACKEND:
- URL: https://$BACKEND_APP_NAME.azurewebsites.net
- App Service: $BACKEND_APP_NAME
- Plan: $APP_SERVICE_PLAN (B1 Basic)

FRONTEND:
- URL: https://$FRONTEND_APP_NAME.azurestaticapps.net
- Static Web App: $FRONTEND_APP_NAME

ESTIMATED COST: ~$18/month
DEPLOYMENT DATE: $(date)
EOF

echo "💾 Información guardada en: deployment-info.txt"
