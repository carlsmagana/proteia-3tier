# 🔧 Proteia Backend API (.NET 8)

## Descripción
API REST desarrollada en .NET 8 para el sistema de inteligencia comercial Proteia. Proporciona endpoints seguros para autenticación, gestión de productos y análisis de mercado.

## 🏗️ Arquitectura
- **Framework:** .NET 8 Web API
- **ORM:** Entity Framework Core
- **Base de Datos:** Azure SQL Database
- **Autenticación:** JWT Bearer Tokens
- **Documentación:** Swagger/OpenAPI

## 📁 Estructura del Proyecto
```
proteia-backend/
├── Controllers/
│   ├── AuthController.cs           # Autenticación y login
│   ├── ProductsController.cs       # Gestión de productos
│   └── DashboardController.cs      # Análisis y métricas
├── Services/
│   ├── AuthService.cs              # Lógica de autenticación
│   ├── ProductService.cs           # Lógica de productos
│   └── DashboardService.cs         # Lógica de dashboard
├── Models/
│   ├── User.cs                     # Modelo de usuario
│   ├── Product.cs                  # Modelo de producto
│   ├── Role.cs                     # Modelo de roles
│   └── UserSession.cs              # Modelo de sesiones
├── DTOs/
│   ├── LoginDto.cs                 # DTOs de autenticación
│   ├── ProductDto.cs               # DTOs de productos
│   └── DashboardDto.cs             # DTOs de dashboard
├── Data/
│   └── ProteiaDbContext.cs         # Contexto de Entity Framework
├── appsettings.json                # Configuración de la aplicación
├── Program.cs                      # Configuración de servicios
└── README.md                       # Esta documentación
```

## 🚀 Configuración e Instalación

### 1. Prerrequisitos
- .NET 8 SDK
- Azure SQL Database configurada
- Visual Studio 2022 o VS Code (opcional)

### 2. Configurar Connection String
Edita `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tu-servidor.database.windows.net;Database=tu-bd;User Id=tu-usuario;Password=tu-password;Encrypt=True;TrustServerCertificate=False;"
  },
  "JwtSettings": {
    "SecretKey": "tu-clave-secreta-muy-larga-y-segura",
    "Issuer": "ProteiaAPI",
    "Audience": "ProteiaClient",
    "ExpirationHours": 8
  }
}
```

### 3. Instalar Dependencias
```bash
dotnet restore
```

### 4. Ejecutar Migraciones (si es necesario)
```bash
dotnet ef database update
```

### 5. Ejecutar la API
```bash
dotnet run
```

La API estará disponible en: `https://localhost:5018`

## 📚 Endpoints Disponibles

### 🔐 Autenticación
```
POST /api/auth/login              # Iniciar sesión
POST /api/auth/refresh            # Renovar token
POST /api/auth/logout             # Cerrar sesión
GET  /health                      # Health check
```

### 📦 Productos
```
GET    /api/products              # Obtener todos los productos
GET    /api/products/{id}         # Obtener producto por ID
GET    /api/products/asin/{asin}  # Obtener producto por ASIN
GET    /api/products/similar      # Productos similares a Proteo50
GET    /api/products/search       # Buscar productos
GET    /api/products/brand/{brand}    # Productos por marca
GET    /api/products/category/{cat}   # Productos por categoría
GET    /api/products/proteo50     # Información de Proteo50
```

### 📊 Dashboard y Análisis
```
GET /api/dashboard/market-overview     # Vista general del mercado
GET /api/dashboard/product-comparison  # Comparación de productos
GET /api/dashboard/prospect-ranking    # Ranking de prospectos
GET /api/dashboard/brand-analysis      # Análisis por marcas
GET /api/dashboard/category-analysis   # Análisis por categorías
```

## 🔧 Desarrollo

### Ejecutar en Modo Desarrollo
```bash
dotnet run --environment Development
```

### Ejecutar Tests
```bash
dotnet test
```

### Generar Build de Producción
```bash
dotnet publish -c Release -o ./publish
```

## 📖 Documentación API

### Swagger UI
Cuando la API esté ejecutándose, visita:
- **Desarrollo:** `https://localhost:5018/swagger`
- **Producción:** `https://tu-dominio.com/swagger`

### Autenticación en Swagger
1. Hacer login en `/api/auth/login`
2. Copiar el token JWT de la respuesta
3. Hacer clic en "Authorize" en Swagger
4. Pegar el token con formato: `Bearer tu-token-jwt`

## 🔐 Seguridad

### JWT Configuration
- **Algoritmo:** HS256
- **Expiración:** 8 horas
- **Refresh Token:** 30 días
- **Issuer/Audience:** Configurables

### CORS Policy
Configurado para permitir:
- **Origins:** `http://localhost:3000` (React dev)
- **Methods:** GET, POST, PUT, DELETE
- **Headers:** Authorization, Content-Type

### Rate Limiting
- Implementado para endpoints de autenticación
- Límite: 10 intentos por minuto por IP

## 🔄 Integración con Otras Capas

### Base de Datos
- **Connection String:** Configurado en appsettings.json
- **Entity Framework:** Code-First approach
- **Migraciones:** Automáticas en desarrollo

### Frontend
- **CORS:** Configurado para React en puerto 3000
- **JSON:** Respuestas en formato JSON estándar
- **Errores:** Códigos HTTP estándar con mensajes descriptivos

## 📊 Logging y Monitoreo

### Logs Disponibles
- **Autenticación:** Login exitoso/fallido
- **Errores:** Stack traces completos
- **Performance:** Tiempo de respuesta de endpoints
- **Base de Datos:** Queries ejecutadas

### Configuración de Logs
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

## 🚀 Despliegue

### Azure App Service
1. Crear App Service en Azure Portal
2. Configurar Connection String en configuración
3. Desplegar usando `dotnet publish`

### Docker (Opcional)
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY ./publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "Proteia.API.dll"]
```

## 📞 Troubleshooting

### Problemas Comunes
1. **Error de conexión a BD:** Verificar connection string
2. **JWT inválido:** Verificar configuración de JwtSettings
3. **CORS errors:** Verificar configuración de CORS policy
4. **404 en endpoints:** Verificar routing en controllers

### Logs Útiles
```bash
# Ver logs en tiempo real
dotnet run --verbosity detailed

# Logs de Entity Framework
dotnet ef migrations list
```

---
**Proteia Backend API v1.0** - Sistema de Inteligencia Comercial  
Desarrollado con .NET 8 para análisis del mercado mexicano de proteínas
