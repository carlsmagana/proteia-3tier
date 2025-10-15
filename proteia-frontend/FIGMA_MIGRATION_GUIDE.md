# 🎨 Guía de Migración desde Figma

## Problema Identificado
Al migrar el prototipo de Figma a React, se perdieron muchos estilos visuales y la fidelidad del diseño original.

## 🔧 Soluciones Recomendadas

### 1. **Exportar Especificaciones desde Figma**

#### Información a Extraer:
- **Colores exactos** (hex codes)
- **Tipografías** (familias, pesos, tamaños)
- **Espaciados** (margins, paddings)
- **Sombras** (box-shadows)
- **Bordes** (border-radius, borders)
- **Dimensiones** exactas de componentes

#### Herramientas de Figma:
```
- Inspect Panel (panel derecho)
- Export assets (imágenes, iconos)
- Design tokens plugins
- Figma to Code plugins
```

### 2. **Crear Sistema de Design Tokens**

#### Archivo de Variables CSS:
```css
:root {
  /* Colores del prototipo Figma */
  --primary-blue: #3B82F6;
  --secondary-gray: #6B7280;
  --success-green: #10B981;
  --background-light: #F8FAFC;
  --text-dark: #1F2937;
  
  /* Tipografías */
  --font-primary: 'Inter', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Espaciados */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Bordes */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
}
```

### 3. **Implementar Componentes con Styled Components**

#### Instalar dependencias:
```bash
npm install styled-components @types/styled-components
```

#### Ejemplo de componente estilizado:
```tsx
import styled from 'styled-components';

const StyledButton = styled.button`
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: 600;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563EB;
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: var(--secondary-gray);
    cursor: not-allowed;
    transform: none;
  }
`;
```

### 4. **Usar Tailwind CSS con Configuración Personalizada**

#### Configurar tailwind.config.js:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Colores exactos de Figma
        'proteia-blue': '#3B82F6',
        'proteia-gray': '#6B7280',
        'proteia-green': '#10B981',
        'proteia-bg': '#F8FAFC',
      },
      fontFamily: {
        'proteia': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'proteia-xs': '0.75rem',
        'proteia-sm': '0.875rem',
        'proteia-base': '1rem',
        'proteia-lg': '1.125rem',
      },
      spacing: {
        'proteia-xs': '0.25rem',
        'proteia-sm': '0.5rem',
        'proteia-md': '1rem',
        'proteia-lg': '1.5rem',
        'proteia-xl': '2rem',
      },
      boxShadow: {
        'proteia-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'proteia-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'proteia-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      }
    }
  }
}
```

### 5. **Recrear Componentes Pixel-Perfect**

#### Proceso recomendado:
1. **Screenshot** del componente en Figma
2. **Overlay** en el navegador para comparar
3. **Ajustar** CSS hasta que coincida exactamente
4. **Usar herramientas** como PerfectPixel (extensión Chrome)

### 6. **Plugins y Herramientas Útiles**

#### Figma Plugins:
- **Figma to React** - Genera código React
- **Figma to CSS** - Extrae estilos CSS
- **Design Tokens** - Exporta tokens de diseño
- **Figma to Tailwind** - Genera clases Tailwind

#### Herramientas del Navegador:
- **PerfectPixel** - Overlay de imágenes
- **Figma Mirror** - Vista en tiempo real
- **DevTools** - Inspección de elementos

## 🚀 Plan de Acción Inmediato

### Paso 1: Auditoría Visual
1. Comparar componente por componente
2. Identificar diferencias principales
3. Priorizar componentes más visibles

### Paso 2: Extraer Design System
1. Documentar colores, tipografías, espaciados
2. Crear archivo de variables CSS
3. Implementar componentes base

### Paso 3: Refactorizar Componentes
1. Aplicar estilos exactos de Figma
2. Usar medidas precisas
3. Implementar estados (hover, focus, disabled)

### Paso 4: Testing Visual
1. Comparar lado a lado con Figma
2. Probar en diferentes resoluciones
3. Validar interacciones y animaciones
