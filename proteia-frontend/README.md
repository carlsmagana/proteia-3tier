# 🎨 Proteia Frontend (React + TypeScript)

## Descripción
Aplicación web desarrollada en React con TypeScript para el sistema de inteligencia comercial Proteia. Proporciona dashboards interactivos para análisis de mercado de productos proteicos en México.

## 🏗️ Arquitectura
- **Framework:** React 18 con TypeScript
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS + CSS Modules
- **Gráficos:** Recharts
- **Autenticación:** JWT con Context API
- **Estado:** React Hooks + Context

## 📁 Estructura del Proyecto
```
proteia-frontend/
├── src/
│   ├── components/              # Componentes React
│   │   ├── ui/                 # Componentes base (Button, Input, etc.)
│   │   ├── charts/             # Componentes de gráficos
│   │   ├── MarketOverview.tsx  # Dashboard general
│   │   ├── CombinedProductComparison.tsx
│   │   ├── ProspectRanking.tsx
│   │   └── SimpleLogin.tsx     # Componente de login
│   ├── contexts/
│   │   └── AuthContext.tsx     # Context de autenticación
│   ├── services/
│   │   ├── api.ts              # Cliente HTTP con interceptores
│   │   ├── authService.ts      # Servicios de autenticación
│   │   └── productService.ts   # Servicios de productos
│   ├── hooks/
│   │   └── useDashboard.ts     # Hooks personalizados
│   ├── data/
│   │   └── consolidated-products.ts  # Tipos y datos
│   ├── styles/
│   │   └── globals.css         # Estilos globales
│   └── main.tsx               # Punto de entrada
├── components/                 # Componentes originales
├── package.json               # Dependencias y scripts
├── vite.config.ts            # Configuración de Vite
├── tailwind.config.js        # Configuración de Tailwind
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Esta documentación
```

## 🚀 Instalación y Configuración

### 1. Prerrequisitos
- Node.js 18+
- npm o yarn
- Backend API ejecutándose en puerto 5018

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:5018
VITE_APP_NAME=Proteia Dashboard
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 🔐 Autenticación

### Credenciales por Defecto
- **Email:** `carlos@x-world.us`
- **Password:** `@Bravenewworld2`

### Sistema de Autenticación
- **JWT Tokens:** Almacenados en localStorage
- **Refresh Automático:** Tokens renovados automáticamente
- **Interceptores:** Manejo automático de headers de autorización
- **Logout Seguro:** Limpieza completa de tokens

## 📊 Dashboards Disponibles

### 1. General Data (Market Overview)
- **Métricas generales:** Total productos, precios promedio
- **Distribución por categorías:** Gráficos de barras y pie
- **Análisis por marcas:** Market share y comparativas
- **Tendencias de precios:** Gráficos de líneas temporales

### 2. Product Comparison
- **Comparación con Proteo50:** Análisis nutricional detallado
- **Productos similares:** Ranking por similitud
- **Análisis competitivo:** Precios y características
- **Oportunidades de mercado:** Gaps identificados

### 3. Prospectos
- **Ranking de oportunidades:** Productos con mayor potencial
- **Análisis de competencia:** Fortalezas y debilidades
- **Segmentación de mercado:** Por precio y categoría
- **Recomendaciones estratégicas:** Basadas en datos

## 🎨 Sistema de Diseño

### Colores Principales
```css
--primary: #3B82F6;      /* Azul principal */
--secondary: #6B7280;    /* Gris secundario */
--success: #10B981;      /* Verde éxito */
--warning: #F59E0B;      /* Amarillo advertencia */
--error: #EF4444;        /* Rojo error */
```

### Componentes UI
- **Buttons:** Variantes primary, secondary, outline
- **Inputs:** Con validación y estados de error
- **Cards:** Contenedores con sombras y bordes
- **Badges:** Indicadores de estado
- **Alerts:** Mensajes de feedback

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
npm run type-check   # Verificación de tipos
```

### Estructura de Componentes
```typescript
// Ejemplo de componente con tipos
interface ComponentProps {
  data: ProductData[];
  loading?: boolean;
  onSelect?: (id: string) => void;
}

export function Component({ data, loading, onSelect }: ComponentProps) {
  // Implementación del componente
}
```

## 🔄 Integración con Backend

### API Client
```typescript
// Configuración automática de headers JWT
const apiClient = new ApiClient('http://localhost:5018');

// Uso en componentes
const { data, loading, error } = useMarketOverview();
```

### Servicios Disponibles
- **AuthService:** Login, logout, refresh tokens
- **ProductService:** CRUD de productos, búsquedas
- **DashboardService:** Métricas y análisis

### Hooks Personalizados
```typescript
// Hook para datos del dashboard
const { data, loading, error, refetch } = useMarketOverview();

// Hook para autenticación
const { user, login, logout, isAuthenticated } = useAuth();
```

## 📱 Responsive Design

### Breakpoints
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1439px
- **Large:** 1440px+

### Optimizaciones Móviles
- Navegación colapsible
- Gráficos adaptables
- Touch-friendly interactions
- Carga lazy de componentes

## 🚀 Build y Despliegue

### Build de Producción
```bash
npm run build
```

### Despliegue en Netlify
1. Conectar repositorio de GitHub
2. Configurar build command: `npm run build`
3. Configurar publish directory: `dist`
4. Agregar variables de entorno

### Despliegue en Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📈 Performance

### Optimizaciones Implementadas
- **Code Splitting:** Carga lazy de rutas
- **Tree Shaking:** Eliminación de código no usado
- **Asset Optimization:** Compresión de imágenes
- **Caching:** Estrategias de cache para assets

### Métricas Objetivo
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3s

## 🔄 Integración con Otras Capas

### Backend API
- **Base URL:** Configurable via variables de entorno
- **Autenticación:** JWT Bearer tokens automáticos
- **Error Handling:** Manejo centralizado de errores HTTP
- **Retry Logic:** Reintentos automáticos en fallos de red

### Base de Datos (Indirecta)
- **Datos en tiempo real:** A través de APIs REST
- **Caching:** Implementado en el cliente
- **Optimistic Updates:** Para mejor UX

## 📞 Troubleshooting

### Problemas Comunes
1. **Error de CORS:** Verificar configuración del backend
2. **Token expirado:** El sistema renueva automáticamente
3. **Datos no cargan:** Verificar conexión con API
4. **Build falla:** Verificar errores de TypeScript

### Debug Mode
```bash
# Ejecutar con logs detallados
npm run dev -- --debug

# Verificar tipos
npm run type-check
```

---
**Proteia Frontend v1.0** - Sistema de Inteligencia Comercial  
Desarrollado con React + TypeScript para análisis del mercado mexicano de proteínas
