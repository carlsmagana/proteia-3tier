# 🧬 Proteia - Sistema de Inteligencia Comercial (3-Tier Architecture)

## Descripción
Sistema completo de inteligencia comercial para análisis del mercado mexicano de proteínas, desarrollado con arquitectura de 3 capas separadas y escalables.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROTEIA 3-TIER SYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│  🎨 FRONTEND (React + TypeScript)                              │
│  ├─ Dashboard interactivo                                      │
│  ├─ Autenticación JWT                                          │
│  ├─ Visualizaciones de datos                                   │
│  └─ Responsive design                                          │
├─────────────────────────────────────────────────────────────────┤
│  🔧 BACKEND (.NET 8 Web API)                                   │
│  ├─ APIs REST seguras                                          │
│  ├─ Autenticación JWT                                          │
│  ├─ Entity Framework Core                                      │
│  └─ Swagger documentation                                      │
├─────────────────────────────────────────────────────────────────┤
│  🗄️ DATABASE (Azure SQL Database)                              │
│  ├─ 331 productos del mercado                                  │
│  ├─ Sistema de usuarios y roles                                │
│  ├─ Análisis de similitud con IA                               │
│  └─ Scripts de configuración                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
proteia-3tier/
├── proteia-database/           # 🗄️ Capa de Base de Datos
│   ├── *.sql                  # Scripts SQL de configuración
│   ├── *.py                   # Herramientas de administración
│   ├── *.csv                  # Datos de productos
│   └── README.md              # Documentación de BD
├── proteia-backend/            # 🔧 Capa de Backend API
│   ├── Controllers/           # Controladores REST
│   ├── Services/              # Lógica de negocio
│   ├── Models/                # Modelos de datos
│   ├── DTOs/                  # Data Transfer Objects
│   └── README.md              # Documentación de API
├── proteia-frontend/           # 🎨 Capa de Frontend Web
│   ├── src/                   # Código fuente React
│   ├── components/            # Componentes UI
│   ├── services/              # Servicios de API
│   ├── contexts/              # Context providers
│   └── README.md              # Documentación de Frontend
└── README.md                  # Esta documentación
```

## 🚀 Inicio Rápido

### 1. **Base de Datos** (Azure SQL)
```bash
cd proteia-database/
python3 test_connection.py      # Probar conexión
python3 verify_tables.py       # Verificar estructura
python3 import_data.py          # Importar productos
```

### 2. **Backend** (.NET 8 API)
```bash
cd proteia-backend/
dotnet restore                  # Instalar dependencias
dotnet run                      # Ejecutar API (puerto 5018)
```

### 3. **Frontend** (React)
```bash
cd proteia-frontend/
npm install                     # Instalar dependencias
npm run dev                     # Ejecutar app (puerto 3000)
```

### 4. **Acceder a la Aplicación**
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5018`
- **Swagger UI:** `http://localhost:5018/swagger`

## 🔐 Credenciales de Acceso

### Usuario por Defecto
- **Email:** `carlos@x-world.us`
- **Password:** `@Bravenewworld2`
- **Rol:** Administrador

## 📊 Funcionalidades Principales

### 🎯 Dashboard de Inteligencia Comercial
- **General Data:** Métricas generales del mercado (331 productos)
- **Product Comparison:** Comparación detallada con Proteo50
- **Prospectos:** Ranking de oportunidades comerciales

### 🔍 Análisis de Mercado
- **Productos similares:** Algoritmo de IA para identificar competencia
- **Análisis nutricional:** Comparación de macronutrientes
- **Segmentación de precios:** Análisis por rangos de precio
- **Market share:** Distribución por marcas y categorías

### 🛡️ Seguridad
- **Autenticación JWT:** Tokens seguros con refresh automático
- **Roles y permisos:** Sistema granular de acceso
- **Conexiones SSL:** Encriptación en todas las comunicaciones
- **Validación de datos:** Sanitización y validación completa

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Estilos)
- **Recharts** (Gráficos)
- **Context API** (Estado global)

### Backend
- **.NET 8** Web API
- **Entity Framework Core** (ORM)
- **JWT Bearer** (Autenticación)
- **Swagger/OpenAPI** (Documentación)
- **CORS** (Cross-origin requests)

### Base de Datos
- **Azure SQL Database**
- **SQL Server** (Compatible)
- **Python** (Scripts de administración)
- **ODBC** (Conectividad)

## 📈 Datos del Sistema

### Productos (331 registros)
- **Mercado:** México
- **Categorías:** Proteínas, barras, suplementos
- **Información:** Nutricional, precios, ratings, disponibilidad
- **Análisis IA:** Similitud con Proteo50 calculada

### Métricas Clave
- **Precio promedio:** $850 MXN
- **Rating promedio:** 4.2/5 estrellas
- **Productos analizados:** 100% con IA
- **Marcas cubiertas:** 50+ marcas principales

## 🔄 Flujo de Datos

```
┌─────────────┐    HTTP/REST    ┌─────────────┐    SQL/EF Core    ┌─────────────┐
│   FRONTEND  │ ──────────────► │   BACKEND   │ ─────────────────► │  DATABASE   │
│   (React)   │                 │  (.NET 8)   │                    │ (Azure SQL) │
│             │ ◄────────────── │             │ ◄───────────────── │             │
└─────────────┘    JSON/JWT     └─────────────┘    Data/Models     └─────────────┘
```

## 🚀 Despliegue en Producción

### Frontend (Netlify/Vercel)
```bash
cd proteia-frontend/
npm run build
# Deploy dist/ folder
```

### Backend (Azure App Service)
```bash
cd proteia-backend/
dotnet publish -c Release
# Deploy to Azure App Service
```

### Base de Datos (Azure SQL)
- Ya configurada y funcionando
- Backup automático habilitado
- Firewall configurado

## 📊 Monitoreo y Logs

### Frontend
- **Console logs:** Errores y debug info
- **Network tab:** Requests HTTP
- **Performance:** Métricas de carga

### Backend
- **Application logs:** .NET logging
- **API metrics:** Response times
- **Error tracking:** Stack traces completos

### Base de Datos
- **Azure Portal:** Métricas de performance
- **Query insights:** Análisis de consultas
- **Connection monitoring:** Estado de conexiones

## 🔧 Desarrollo y Contribución

### Configuración de Desarrollo
1. **Clonar** cada capa por separado
2. **Configurar** variables de entorno
3. **Ejecutar** cada capa en orden (BD → Backend → Frontend)
4. **Probar** integración completa

### Estándares de Código
- **Frontend:** ESLint + Prettier + TypeScript strict
- **Backend:** .NET coding standards + XML documentation
- **Base de Datos:** Naming conventions + comentarios SQL

## 📞 Soporte y Troubleshooting

### Problemas Comunes
1. **Error de conexión BD:** Verificar firewall Azure SQL
2. **CORS errors:** Verificar configuración backend
3. **JWT expirado:** Sistema de refresh automático
4. **Build failures:** Verificar dependencias y tipos

### Contacto
- **Documentación:** Ver README de cada capa
- **Issues:** Crear tickets específicos por capa
- **Performance:** Revisar métricas en Azure Portal

## 🎉 Estado del Proyecto

### ✅ Completado
- ✅ Arquitectura 3-tier implementada
- ✅ Base de datos con 331 productos
- ✅ Backend API con 13+ endpoints
- ✅ Frontend con 3 dashboards interactivos
- ✅ Autenticación JWT completa
- ✅ Integración end-to-end funcionando

### 🔄 En Desarrollo
- 🔄 Optimizaciones de performance
- 🔄 Tests automatizados
- 🔄 Métricas avanzadas de IA
- 🔄 Exportación de reportes

---

**Proteia v1.0** - Sistema de Inteligencia Comercial  
Desarrollado para análisis del mercado mexicano de proteínas  
**Arquitectura:** 3-Tier | **Stack:** React + .NET 8 + Azure SQL
