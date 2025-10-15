# 🗄️ Proteia Database Layer

## Descripción
Capa de base de datos para el sistema de inteligencia comercial Proteia. Contiene scripts SQL, configuraciones de conexión y datos de productos del mercado mexicano.

## 🏗️ Arquitectura
- **Base de Datos:** Azure SQL Database
- **Productos:** 331 productos del mercado mexicano de proteínas
- **Usuarios:** Sistema de autenticación integrado
- **Análisis:** Datos de similitud con Proteo50

## 📁 Estructura del Proyecto
```
proteia-database/
├── 00_setup_config_users.sql        # Configuración inicial de usuarios
├── 01_create_tables.sql             # Creación de tablas principales
├── 02_initial_data.sql              # Datos iniciales y roles
├── 03_import_products.sql           # Importación de productos
├── 04_user_integration.sql          # Integración de usuarios
├── consolidated-products.csv        # Datos de productos (331 registros)
├── connection_config.py             # Configuración de conexión
├── test_connection.py               # Prueba de conexión
├── import_data.py                   # Importación de datos
├── verify_tables.py                 # Verificación de tablas
├── check_users.py                   # Verificación de usuarios
└── README.md                        # Esta documentación
```

## 🚀 Configuración Inicial

### 1. Configurar Conexión
Edita `connection_config.py` con tus credenciales de Azure SQL:
```python
SERVER = "tu-servidor.database.windows.net"
DATABASE = "tu-base-de-datos"
USERNAME = "tu-usuario"
PASSWORD = "tu-contraseña"
```

### 2. Ejecutar Scripts de Configuración
```bash
# 1. Probar conexión
python3 test_connection.py

# 2. Verificar/crear tablas
python3 verify_tables.py

# 3. Importar datos de productos
python3 import_data.py

# 4. Verificar usuarios
python3 check_users.py
```

## 📊 Datos Disponibles

### Productos (331 registros)
- **Información nutricional:** Proteínas, carbohidratos, grasas, calorías
- **Precios y disponibilidad:** Precios en MXN, disponibilidad en tiendas
- **Análisis de similitud:** Comparación automática con Proteo50
- **Categorización:** Por marcas, tipos de producto, segmentos

### Sistema de Usuarios
- **Autenticación:** JWT tokens con refresh
- **Roles disponibles:** Admin, Analyst, Viewer, Manager
- **Usuario por defecto:** carlos@x-world.us / @Bravenewworld2

## 🔧 Herramientas de Administración

### Scripts de Verificación
```bash
python3 test_connection.py          # Probar conexión a Azure SQL
python3 verify_tables.py           # Verificar estructura de tablas
python3 check_users.py             # Revisar usuarios y credenciales
```

### Scripts de Datos
```bash
python3 import_data.py              # Importar productos desde CSV
```

## 📈 Métricas del Dataset

### Distribución de Productos
- **Total productos:** 331
- **Precio promedio:** $850 MXN
- **Rating promedio:** 4.2/5 estrellas
- **Productos con análisis de similitud:** 100%

### Categorías Principales
- Proteínas en polvo
- Barras proteicas  
- Suplementos nutricionales
- Productos orgánicos

## 🔐 Configuración de Seguridad

### Azure SQL Database
1. **Firewall:** Configurar IP whitelist en Azure Portal
2. **SSL/TLS:** Conexiones encriptadas obligatorias
3. **Credenciales:** Usar variables de entorno para producción

### Configuración de Firewall
```
Azure Portal → SQL Server → Configuración → Firewalls y redes virtuales
→ Agregar IP actual o rango de IPs permitidas
```

## 🔄 Integración con Otras Capas

### Backend (.NET 8 Web API)
- **Connection String:** Configurado en appsettings.json
- **Entity Framework:** Modelos mapeados a tablas
- **Autenticación:** Integración con tabla config.users

### Frontend (React)
- **APIs:** Consume datos a través del backend
- **Dashboards:** Visualiza métricas y análisis
- **Autenticación:** Login integrado con sistema de usuarios

## 📞 Troubleshooting

### Problemas Comunes
1. **Error de conexión:** Verificar firewall de Azure SQL
2. **Tablas faltantes:** Ejecutar scripts de creación
3. **Datos vacíos:** Ejecutar import_data.py
4. **Login fallido:** Verificar credenciales con check_users.py

### Logs y Monitoreo
- **Azure Portal:** Métricas y logs de SQL Database
- **Scripts Python:** Output detallado de operaciones
- **Connection timeouts:** Configurados para 30s

---
**Proteia Database Layer v1.0** - Sistema de Inteligencia Comercial  
Desarrollado para análisis del mercado mexicano de proteínas
