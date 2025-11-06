# 🎉 Backend-Papeleria - Proyecto Completado

## 📋 Resumen del Proyecto

El backend para "Palacio Del Papel" ha sido completado exitosamente con todas las funcionalidades requeridas de autenticación, autorización y gestión de datos.

## ✅ Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- **JWT + Cookies HTTP-only** para manejo seguro de sesiones
- **bcrypt** para encriptación de contraseñas
- **Middleware de autenticación** para rutas protegidas
- **Sistema de roles** (admin, manager, user)
- **Endpoints completos**: register, login, logout, profile, verify

### 🛡️ Sistema de Autorización
- **Middleware `authenticateToken`**: Verifica tokens JWT
- **Middleware `requireRole`**: Control de acceso basado en roles
- **Protección de rutas CRUD** según permisos de usuario

### 📊 Gestión de Datos
- **Productos**: CRUD completo con categorías y proveedores
- **Proveedores**: Gestión de empresas proveedoras
- **Inventario**: Control de stock con timestamps
- **Categorías**: Organización de productos

### 🔧 Configuración Técnica
- **Express.js** con ES6 modules
- **MongoDB + Mongoose** para base de datos
- **CORS configurado** para frontend
- **Variables de entorno** para configuración
- **Script de seed** para inicialización

## 🗂️ Estructura del Proyecto

```
Backend-Papeleria/
├── src/
│   ├── app.js                 # Punto de entrada
│   ├── server.js              # Configuración del servidor
│   ├── controller/            # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── supplier.controller.js
│   │   ├── inventory.controller.js
│   │   └── category.controller.js
│   ├── data/                  # Base de datos
│   │   ├── mongoose.js
│   │   ├── seed.js
│   │   └── schema/            # Modelos MongoDB
│   ├── middleware/            # Middlewares personalizados
│   │   └── auth.middleware.js
│   ├── repository/            # Acceso a datos
│   │   ├── role.repository.js
│   │   └── users.respository.js
│   └── routes/                # Definición de rutas
│       ├── routes.js
│       ├── auth.routes.js
│       ├── product.routes.js
│       ├── supplier.routes.js
│       ├── inventory.routes.js
│       └── category.routes.js
├── .env                       # Variables de entorno
├── package.json              # Dependencias
└── README.md                 # Documentación
```

## 🔌 Endpoints Disponibles

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/profile` - Perfil de usuario
- `GET /auth/verify` - Verificar autenticación

### Productos
- `GET /products` - Listar productos (todos)
- `GET /products/:id` - Obtener producto (todos)
- `POST /products` - Crear producto (admin/manager)
- `PUT /products/:id` - Actualizar producto (admin/manager)
- `DELETE /products/:id` - Eliminar producto (admin)

### Proveedores
- `GET /suppliers` - Listar proveedores (todos)
- `GET /suppliers/:id` - Obtener proveedor (todos)
- `POST /suppliers` - Crear proveedor (admin/manager)
- `PUT /suppliers/:id` - Actualizar proveedor (admin/manager)
- `DELETE /suppliers/:id` - Eliminar proveedor (admin)

### Inventario
- `GET /inventory` - Listar inventario (todos)
- `GET /inventory/:id` - Obtener registro (todos)
- `POST /inventory` - Crear registro (admin/manager)
- `PUT /inventory/:id` - Actualizar registro (admin/manager)
- `DELETE /inventory/:id` - Eliminar registro (admin)

### Categorías
- `GET /categories` - Listar categorías (todos)
- `GET /categories/:id` - Obtener categoría (todos)
- `POST /categories` - Crear categoría (admin/manager)
- `PUT /categories/:id` - Actualizar categoría (admin/manager)
- `DELETE /categories/:id` - Eliminar categoría (admin)

## 🔐 Sistema de Seguridad

### Autenticación JWT
- Tokens almacenados en cookies HTTP-only
- Expiración configurable (24h por defecto)
- Verificación automática en cada request protegido

### Autorización por Roles
- **admin**: Acceso completo (CRUD completo)
- **manager**: Crear y actualizar (sin eliminar)
- **user**: Solo lectura (GET requests)

### Middlewares Implementados
```javascript
// authenticateToken - Verifica token JWT
app.use(authenticateToken);

// requireRole - Control de acceso
app.post('/products', requireRole(['admin', 'manager']), controller.create);
```

## 🚀 Instalación y Uso

### Prerequisitos
- Node.js 18+
- MongoDB (local o Atlas)
- Variables de entorno configuradas

### Configuración Rápida
1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Inicializar base de datos**
   ```bash
   npm run seed
   ```

4. **Ejecutar servidor**
   ```bash
   npm run dev    # Desarrollo
   npm start      # Producción
   ```

### Usuario por Defecto
Después del seed:
- **Email:** admin@papeleria.com
- **Password:** admin123
- **Rol:** admin

## 🧪 Testing

Se incluye script de pruebas:
```bash
node test-auth.js
```

## 📊 Modelos de Datos

### Usuario
- username (único)
- email (único)
- password (hashed)
- rol (referencia a Role)

### Rol
- roleName (único): "admin", "manager", "user"

### Producto
- name, description, price
- category (referencia)
- suppliers (array de referencias)
- image

### Proveedor
- companyName (único)
- email, phone

### Inventario
- product (referencia)
- stock, lastUpdated

### Categoría
- name (único)
- description

## 🔧 Scripts Disponibles

- `npm run dev` - Desarrollo con hot reload
- `npm start` - Producción
- `npm run seed` - Inicializar base de datos

## 🌟 Características Destacadas

1. **Seguridad Robusta**: JWT + cookies HTTP-only + bcrypt
2. **Control de Acceso Granular**: Middleware por rol en cada endpoint
3. **API RESTful Completa**: CRUD para todas las entidades
4. **Documentación Extensa**: README con ejemplos y guías
5. **Configuración Flexible**: Variables de entorno para todos los aspectos
6. **Base de Datos Inicializada**: Script de seed con roles y admin

## 🎯 Estado del Proyecto

✅ **COMPLETADO** - Todas las funcionalidades implementadas y probadas

- [x] Autenticación JWT con cookies
- [x] Sistema de roles y permisos
- [x] Middleware de seguridad
- [x] CRUD completo para todas las entidades
- [x] Documentación completa
- [x] Scripts de inicialización
- [x] Configuración de entorno
- [x] Pruebas de funcionalidad

## 👥 Autores

- **Arekkazu** - Desarrollo
- **Daffy** - Desarrollo
- **MiguelDev** - Desarrollo

---

**🚀 ¡Backend listo para producción!**

El sistema está completamente funcional con autenticación segura, autorización por roles y todas las operaciones CRUD necesarias para gestionar una papelería.