# 🎨 Paleta de Colores - APP-SGI-WELDER-LEGION

## 📋 Descripción
Sistema de colores unificado basado en psicología del color y accesibilidad. Principio 50/30/20: 50% claro, 30% oscuro, 20% comunicativo.

## 🎯 Colores Principales

### 🔵 Primarios (Acción, CTA, Información)
- **Main**: `#748FFC` - Botones principales, acciones
- **Light**: `#E3E6FF` - Fondos claros
- **Dark**: `#4A5ACD` - Hover, estados activos
- **Text**: `#FFFFFF` - Texto sobre fondo

### ✅ Éxito (Confirmaciones)
- **Main**: `#69DB7C` - Íconos, botones éxito
- **Light**: `#D6F7E8` - Fondos claros
- **Dark**: `#4AA95E` - Hover

### ❌ Error (Problemas)
- **Main**: `#FF8787` - Botones, íconos de error
- **Light**: `#FFE8E8` - Fondos claros
- **Dark**: `#E74C3C` - Hover

### ⚠️ Advertencia (Atención)
- **Main**: `#FFB84D` - Íconos, botones advertencia
- **Light**: `#FFF3D9` - Fondos claros
- **Dark**: `#F39C12` - Hover

### ℹ️ Información (Datos)
- **Main**: `#5DADE2` - Íconos, información
- **Light**: `#D6EBF5` - Fondos claros
- **Dark**: `#3498DB` - Hover

## 🧩 Componentes Actualizados

### Button
```tsx
<Button variant="default">Primary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>
<Button variant="destructive">Error</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
```

### Badge
```tsx
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

## 📁 Estructura de Archivos

```
src/shared/constants/
├── colors.ts          # Paleta de colores principal
├── constants.ts       # Opciones de formularios
└── filters.tsx        # Filtros de búsqueda
```

## 🔧 Configuración de Tailwind

La configuración de `tailwind.config.js` está integrada con la paleta de colores para mantener consistencia en toda la aplicación.

## 📝 Uso en Código

```tsx
import { COLORS } from '@/shared/constants/colors';
import { BRAND_OPTIONS, CURRENCY_OPTIONS } from '@/shared/constants/constants';

// Usar colores directamente
const primaryColor = COLORS.primary.main;

// Usar opciones de constantes
<Select options={BRAND_OPTIONS} />
```

## 🎨 Principios de Diseño

1. **Consistencia**: Todos los componentes usan la misma paleta
2. **Accesibilidad**: Contraste adecuado para legibilidad
3. **Psicología**: Colores transmiten el mensaje correcto
4. **Escalabilidad**: Fácil agregar nuevos colores o variantes

## 🔄 Migración

Los componentes antiguos que usaban colores hardcodeados han sido actualizados para usar la paleta unificada. Si encuentras colores hardcodeados, reemplázalos con las constantes de `COLORS`.