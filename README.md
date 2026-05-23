# SGI Welder Legion

Aplicación móvil React Native con Firebase para gestión de inventario y movimientos.

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Android Studio
- JDK 17 o superior
- Git

## 🔧 Configuración del Entorno

### 1. Configurar ANDROID_HOME en el PATH

Es necesario configurar la variable de entorno `ANDROID_HOME` para que apunte a tu instalación de Android SDK.

**Windows:**
```bash
# Agregar a las variables de entorno del sistema:
ANDROID_HOME=C:\Users\TU_USUARIO\AppData\Local\Android\Sdk

# Agregar al PATH:
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%ANDROID_HOME%\emulator
```

**macOS/Linux:**
```bash
# Agregar al archivo ~/.bashrc o ~/.zshrc:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/emulator
```

Para verificar que está configurado correctamente:
```bash
echo $ANDROID_HOME  # macOS/Linux
echo %ANDROID_HOME% # Windows
adb --version
```

### 2. Actualizar Android SDK Tools

Abre Android Studio y actualiza los componentes necesarios:

1. Abre **Android Studio**
2. Ve a **Tools > SDK Manager**
3. En la pestaña **SDK Platforms**, asegúrate de tener instalado:
   - Android 13.0 (API Level 33) o superior
   - Android SDK Platform-Tools
   
4. En la pestaña **SDK Tools**, verifica que estén instalados:
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android Emulator
   - Android SDK Platform-Tools
   - Google Play Services

5. Haz clic en **Apply** para instalar o actualizar los componentes

### 3. Ubicación del Proyecto (Ruta Corta)

**⚠️ IMPORTANTE**: Windows tiene limitaciones con rutas muy largas. Se recomienda mover el proyecto a una ubicación con ruta corta para evitar errores durante la compilación.

**Ubicación recomendada:**
```
C:\Projects\sgi-welder
```

**NO recomendado:**
```
C:\Users\nombreusuario\Documents\Proyectos\React Native\sgi-welder-legion
```

Si ya tienes el proyecto en una ruta larga:
```bash
# Habilitar rutas largas en Windows (Ejecutar como Administrador)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# O mover el proyecto a una ruta más corta
move "ruta-larga\sgi-welder-legion" "C:\Projects\sgi-welder"
```
