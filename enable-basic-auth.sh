#!/bin/bash

# 🔧 HABILITAR BASIC AUTHENTICATION PARA WEB APP
# Necesario para descargar publish profile

# Variables (CAMBIAR POR TUS VALORES)
RESOURCE_GROUP="proteia-rg"
WEBAPP_NAME="proteia-api"

echo "🔐 Habilitando Basic Authentication para: $WEBAPP_NAME"

# Habilitar Basic Auth para SCM
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --generic-configurations '{"basicAuthEnabled": true}'

# Verificar configuración
echo "✅ Verificando configuración..."
az webapp config show \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --query "basicAuthEnabled"

echo ""
echo "🎯 Ahora puedes descargar el publish profile desde Azure Portal:"
echo "   Web App → Overview → Get publish profile"
echo ""
echo "🔗 URL de tu Web App:"
echo "   https://$WEBAPP_NAME.azurewebsites.net"
