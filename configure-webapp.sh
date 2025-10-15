#!/bin/bash

# 🔧 CONFIGURAR WEB APP DESDE AZURE CLI
# Usar si no encuentras las opciones en Azure Portal

# Variables (CAMBIAR POR TUS VALORES REALES)
RESOURCE_GROUP="proteia-rg"
WEBAPP_NAME="proteia-api"
CONNECTION_STRING="Server=tcp:[TU-SERVIDOR].database.windows.net,1433;Initial Catalog=[TU-BD];Persist Security Info=False;User ID=[TU-USUARIO];Password=[TU-PASSWORD];MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

echo "🔧 Configurando Web App: $WEBAPP_NAME"

# 1. Configurar variables de entorno
echo "📝 Configurando variables de entorno..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=false

# 2. Configurar connection string
echo "🗄️ Configurando connection string..."
az webapp config connection-string set \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="$CONNECTION_STRING"

# 3. Configurar CORS
echo "🌐 Configurando CORS..."
az webapp cors add \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --allowed-origins \
    "https://*.azurestaticapps.net" \
    "http://localhost:3000"

echo "✅ Configuración completada!"
echo ""
echo "🔗 URL de tu Web App:"
az webapp show \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --query "defaultHostName" \
  --output tsv

echo ""
echo "📋 Para verificar configuración:"
echo "az webapp config show --resource-group $RESOURCE_GROUP --name $WEBAPP_NAME"
