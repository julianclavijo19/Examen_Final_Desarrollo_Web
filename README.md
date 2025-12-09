# Examen Final Desarrollo Web - Sistema de Gestión

Aplicación web SPA para gestión de Usuarios y Productos con Vue.js 3, Bootstrap 5 y MockAPI.

## 🚀 Tecnologías Utilizadas

- **Vue.js 3** - Framework JavaScript progresivo
- **Vue Router** - Navegación y rutas protegidas
- **Bootstrap 5** - Framework CSS para diseño responsive
- **Bootstrap Icons** - Iconografía
- **Axios** - Cliente HTTP para consumir API
- **MockAPI** - API REST simulada

## 📋 Funcionalidades Implementadas

### ✅ Autenticación
- Login con validación contra MockAPI
- Protección de rutas con navigation guards
- Tokens simulados en localStorage
- Botón de cerrar sesión

### ✅ CRUD de Usuarios
- Listado de usuarios desde MockAPI
- Crear usuario mediante modal
- Editar usuario mediante modal
- Eliminar usuario con modal de confirmación
- Alertas Bootstrap para cada operación

### ✅ CRUD de Productos
- Listado de productos desde MockAPI
- Crear producto mediante modal
- Editar producto mediante modal
- Eliminar producto con confirmación
- Buscador de productos
- Filtro por categoría
- Alertas Bootstrap para feedback



## 🌐 MockAPI Configuración

### Recursos:
- **User_login**: `https://6937843bf8dc350aff346de2.mockapi.io/api/v1/User_login`
- **Products**: `https://6937843bf8dc350aff346de2.mockapi.io/api/v1/Products`

### Campos User_login:
- `id`, `nombre`, `email`, `contraseña`

### Campos Products:
- `id`, `name`, `descripcion`, `precio`, `cantidad`, `categoria`

## 🔐 Usuarios de Prueba

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "contraseña": "123456"
}
```

## 🛣️ Rutas

- `/` - Redirige a `/login`
- `/login` - Página de inicio de sesión
- `/productos` - Gestión de productos (protegida)
- `/usuarios` - Gestión de usuarios (protegida)

## 🎯 Cumplimiento de Requisitos

### Requisitos Funcionales ✅
- [x] Formulario de login con validación MockAPI
- [x] Token en localStorage
- [x] Rutas protegidas
- [x] CRUD completo Usuarios con modales
- [x] CRUD completo Productos con modales
- [x] Alertas Bootstrap
- [x] Bootstrap Icons

### Requisitos No Funcionales ✅
- [x] Diseño responsive
- [x] Componentes reutilizables
- [x] Manejo de errores
- [x] Código organizado y comentado
