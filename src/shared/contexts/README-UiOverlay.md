# UiOverlayContext - Documentación

> Hook global para manejar alertas y loading sin prop drilling. Implementa la arquitectura de PFacilito-Web-Core en React Native.

## 📋 Ubicación

- **Contexto**: `src/shared/contexts/UiOverlayContext.tsx`
- **Provider**: Envuelve toda la app en `App.tsx`
- **Hook**: Disponible en cualquier componente con `useUiOverlay()`

## 🚀 API

### `useUiOverlay()`

```ts
const {
  showAlert,      // Mostrar alerta con acciones
  hideAlert,      // Cerrar alerta actual
  startLoading,   // Mostrar overlay de loading
  stopLoading,    // Cerrar overlay de loading
} = useUiOverlay();
```

### `showAlert(config)`

```ts
interface AlertConfig {
  icon?: 'warning' | 'success' | 'error' | 'loading';
  title: string;
  text?: string;
  description?: string;
  actions?: AlertAction[];
}

interface AlertAction {
  name: string;
  color?: 'white' | 'blue' | 'orange';
  onClick?: () => boolean | void | Promise<boolean | void>;
}
```

**Retorno en onClick:**
- `false` → No cierra el modal (útil para validaciones)
- `true` o `undefined` → Cierra automáticamente

### `startLoading(config)`

```ts
interface LoadingConfig {
  title?: string;
  text?: string;
}
```

## 📝 Ejemplos

### Alerta Simple

```tsx
import { useUiOverlay } from '@/shared/contexts/UiOverlayContext';

export function MiComponente() {
  const { showAlert } = useUiOverlay();

  const handleClick = () => {
    showAlert({
      icon: 'success',
      title: '¡Éxito!',
      text: 'La operación se completó.',
      actions: [
        { name: 'ACEPTAR', color: 'blue' }
      ],
    });
  };

  return <button onClick={handleClick}>Abrir Alerta</button>;
}
```

### Loading durante operación async

```tsx
const { startLoading, stopLoading } = useUiOverlay();

const handleGuardar = async () => {
  startLoading({ title: 'Guardando', text: 'Por favor espera...' });

  try {
    await miAPI.guardar(datos);
    showAlert({
      icon: 'success',
      title: '¡Guardado!',
      actions: [{ name: 'OK', color: 'blue' }],
    });
  } finally {
    stopLoading();
  }
};
```

### Validación con retorno false

```tsx
showAlert({
  icon: 'warning',
  title: 'Validación',
  text: 'Por favor completa todos los campos.',
  actions: [
    {
      name: 'REVISAR',
      color: 'blue',
      onClick: () => false, // ← NO cierra, usuario debe llenar campos
    },
  ],
});
```

### Alerta con navegación

```tsx
const navigate = useNavigation();

showAlert({
  icon: 'success',
  title: 'Producto creado',
  actions: [
    {
      name: 'IR A DETALLES',
      color: 'blue',
      onClick: () => {
        navigate('ProductDetail', { id: 123 });
        return true; // Cierra la alerta
      },
    },
  ],
});
```

## 🎨 Íconos Disponibles

| Icon | Uso | Color |
|------|-----|-------|
| `success` | Operación exitosa | Verde |
| `error` | Error/Fallo | Rojo |
| `warning` | Advertencia/Confirmación | Ámbar |
| `loading` | Procesando | Azul |

## 🎯 Cuándo Usar

| Caso | Solución |
|------|----------|
| Mostrar loading durante operación | `startLoading()` → `stopLoading()` |
| Alerta de éxito después de guardar | `showAlert()` con `icon: 'success'` |
| Alerta de error en try/catch | `showAlert()` con `icon: 'error'` |
| Confirmar antes de eliminar | Usar `<AlertDialog>` directo (ver ejemplo) |
| Formulario en modal | Usar `<Dialog>` directo |

## ⚠️ Limitaciones

- ✅ Una sola alerta visible a la vez
- ✅ Loading overlay ocupa toda la pantalla
- ✅ No compatible con navegación de Stack directamente
- ✅ Para modales personalizados, usar `<Dialog>` o `<AlertDialog>` directo

## 📚 Referencias

- Implementación: `src/modules/products/screens/ListScreen.tsx`
