# 🚀 Guía de Inicio Rápido - Proteia 3-Tier

## ¡Bienvenido al Sistema de Inteligencia Comercial Proteia!

Esta guía te ayudará a poner en funcionamiento tu sistema completo en menos de 10 minutos.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **.NET 8 SDK** - [Descargar aquí](https://dotnet.microsoft.com/download/dotnet/8.0)
- ✅ **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- ✅ **Python 3.8+** - [Descargar aquí](https://python.org/)
- ✅ **Acceso a Azure SQL Database** - Configurado previamente

## 🎯 Inicio Automático (Recomendado)

### Opción 1: Script Automático
```bash
cd /Users/carlosmagana/CascadeProjects/proteia-3tier/
./start-all.sh
```

Este script:
1. ✅ Verifica la conexión a la base de datos
2. ✅ Inicia el backend en puerto 5018
3. ✅ Inicia el frontend en puerto 3000
4. ✅ Muestra el estado de todos los servicios

## 🔧 Inicio Manual (Paso a Paso)

### Paso 1: Base de Datos
```bash
cd proteia-database/
python3 test_connection.py
```
**Resultado esperado:** ✅ Conexión exitosa a Azure SQL

### Paso 2: Backend API
```bash
cd ../proteia-backend/
dotnet restore
dotnet run
```
**Resultado esperado:** ✅ API corriendo en `http://localhost:5018`

### Paso 3: Frontend Web
```bash
cd ../proteia-frontend/
npm install
npm run dev
```
**Resultado esperado:** ✅ App corriendo en `http://localhost:3000`

## 🔐 Acceso al Sistema

### Credenciales
- **URL:** `http://localhost:3000`
- **Email:** `carlos@x-world.us`
- **Password:** `@Bravenewworld2`

### Primeros Pasos
1. **Abrir** `http://localhost:3000`
2. **Iniciar sesión** con las credenciales
3. **Explorar** las 3 pestañas del dashboard:
   - 📊 **General Data** - Métricas del mercado
   - 🔍 **Product Comparison** - Comparación con Proteo50
   - 🎯 **Prospectos** - Oportunidades comerciales

## 🛠️ URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | `http://localhost:3000` | Dashboard principal |
| **Backend API** | `http://localhost:5018` | API REST |
| **Swagger UI** | `http://localhost:5018/swagger` | Documentación API |
| **Health Check** | `http://localhost:5018/health` | Estado del backend |

## 📊 Datos Disponibles

### Productos del Mercado
- **Total:** 331 productos
- **Mercado:** México
- **Categorías:** Proteínas, barras, suplementos
- **Análisis IA:** Similitud con Proteo50

### Funcionalidades
- 🔍 **Búsqueda** de productos por nombre, marca, categoría
- 📈 **Análisis** nutricional y de precios
- 🎯 **Ranking** de oportunidades comerciales
- 📊 **Visualizaciones** interactivas

## 🔧 Comandos Útiles

### Gestión del Sistema
```bash
# Iniciar todo
./start-all.sh

# Detener todo
./stop-all.sh

# Ver logs
tail -f proteia-backend/backend.log
tail -f proteia-frontend/frontend.log
```

### Desarrollo
```bash
# Backend - Rebuild
cd proteia-backend/
dotnet build

# Frontend - Rebuild
cd proteia-frontend/
npm run build

# Base de datos - Verificar
cd proteia-database/
python3 verify_tables.py
```

## 🐛 Solución de Problemas

### ❌ Error: "Puerto ya en uso"
```bash
# Verificar qué está usando el puerto
lsof -i :3000  # Frontend
lsof -i :5018  # Backend

# Detener proceso
kill -9 <PID>
```

### ❌ Error: "No se puede conectar a la base de datos"
```bash
cd proteia-database/
python3 test_connection.py
```
**Solución:** Verificar firewall de Azure SQL y credenciales

### ❌ Error: "CORS policy"
**Solución:** El backend debe estar corriendo antes que el frontend

### ❌ Error: "JWT token expired"
**Solución:** El sistema renueva automáticamente, solo refresca la página

## 📈 Monitoreo

### Verificar Estado
```bash
# Backend funcionando
curl http://localhost:5018/health

# Frontend funcionando
curl http://localhost:3000

# Base de datos conectada
cd proteia-database/ && python3 test_connection.py
```

### Logs en Tiempo Real
```bash
# Ver logs del backend
tail -f proteia-backend/backend.log

# Ver logs del frontend
tail -f proteia-frontend/frontend.log
```

## 🎯 Próximos Pasos

### Explorar el Dashboard
1. **General Data** - Métricas generales del mercado
2. **Product Comparison** - Análisis detallado vs Proteo50
3. **Prospectos** - Oportunidades identificadas por IA

### APIs Disponibles
- `GET /api/products` - Lista de productos
- `GET /api/dashboard/market-overview` - Métricas del mercado
- `GET /api/dashboard/product-comparison` - Comparaciones
- `GET /api/dashboard/prospect-ranking` - Rankings

### Personalización
- **Frontend:** Modificar componentes en `proteia-frontend/src/`
- **Backend:** Agregar endpoints en `proteia-backend/Controllers/`
- **Base de datos:** Scripts en `proteia-database/`

## 🆘 Soporte

### Documentación Detallada
- **Base de datos:** `proteia-database/README.md`
- **Backend:** `proteia-backend/README.md`
- **Frontend:** `proteia-frontend/README.md`

### Contacto
- **Issues técnicos:** Revisar logs y documentación
- **Nuevas funcionalidades:** Modificar código fuente
- **Performance:** Revisar métricas en Azure Portal

---

## 🎉 ¡Listo para Usar!

Tu sistema de inteligencia comercial está configurado y funcionando. 

**¡Explora los datos del mercado mexicano de proteínas y descubre nuevas oportunidades comerciales!** 🚀

---
**Proteia v1.0** - Sistema de Inteligencia Comercial  
**Stack:** React + .NET 8 + Azure SQL | **Arquitectura:** 3-Tier
