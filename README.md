# 📝 Palacio Del Papel - Backend API

Backend API para el sistema de gestión de papelería "Palacio Del Papel". Una solución completa para la gestión de inventario, ventas y administración de una papelería con autenticación JWT y autorización por roles.

## 🚀 Características

- ✅ API RESTful con Express.js
- 🗄️ Base de datos MongoDB con Mongoose
- 🔐 Autenticación JWT con bcrypt
- 🍪 Manejo de sesiones con cookies HTTP-only
- 👥 Sistema de roles y permisos
- 📁 Manejo de archivos con express-fileupload
- 📊 Logging de requests con Morgan
- 🔄 Hot reload con Nodemon
- 🌱 Variables de entorno para configuración
- 🔒 Middleware de autenticación y autorización

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Tokens de autenticación
- **bcrypt** - Hashing de contraseñas
- **cookie-parser** - Manejo de cookies
- **Morgan** - HTTP request logger
- **Nodemon** - Desarrollo con auto-reload

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [MongoDB](https://www.mongodb.com/) o acceso a MongoDB Atlas
- [Git](https://git-scm.com/)

## ⚡ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Backend-Papeleria
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017
   PORT=4000

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
   JWT_EXPIRES_IN=24h

   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:3000

   # Environment
   NODE_ENV=development
   ```

4. **Inicializar la base de datos**
   ```bash
   npm run seed
   ```

5. **Iniciar la aplicación**

   **Desarrollo:**
   ```bash
   npm run dev
   ```

   **Producción:**
   ```bash
   npm start
   ```

## 📁 Estructura del Proyecto

```
Backend-Papeleria/
├── src/
│   ├── app.js              # Punto de entrada de la aplicación
│   ├── server.js           # Configuración del servidor Express
│   ├── controller/         # Controladores de la API
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── supplier.controller.js
│   │   ├── inventory.controller.js
│   │   ├── category.controller.js
│   │   ├── cart.controller.js
│   │   ├── discount.controller.js
│   │   ├── review.controller.js
│   │   └── sales.controller.js
│   ├── data/               # Configuración de base de datos
│   │   ├── mongoose.js
│   │   ├── seed.js
│   │   └── schema/         # Esquemas de MongoDB
│   │       ├── users.schemas.js
│   │       ├── roles.schemas.js
│   │       ├── products.schema.js
│   │       ├── suppliers.schema.js
│   │       ├── inventory.schema.js
│   │       ├── categories.schema.js
│   │       ├── cart.schema.js
│   │       ├── discounts.schema.js
│   │       ├── review.schema.js
│   │       └── sales.schema.js
│   ├── middleware/         # Middlewares personalizados
│   │   └── auth.middleware.js
│   └── routes/             # Definición de rutas
│       ├── routes.js
│       ├── auth.routes.js
│       ├── product.routes.js
│       ├── supplier.routes.js
│       ├── inventory.routes.js
│       ├── category.routes.js
│       ├── cart.routes.js
│       ├── discount.routes.js
│       ├── review.routes.js
│       └── sales.routes.js
├── .env                    # Variables de entorno
├── nodemon.json           # Configuración de Nodemon
├── package.json           # Dependencias y scripts
└── README.md              # Este archivo
```

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Registrar nuevo usuario | ❌ |
| POST | `/auth/login` | Iniciar sesión | ❌ |
| POST | `/auth/logout` | Cerrar sesión | ✅ |
| GET | `/auth/profile` | Obtener perfil del usuario | ✅ |
| GET | `/auth/verify` | Verificar autenticación | ✅ |

### Productos

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/products` | Obtener todos los productos | Todos |
| GET | `/products/:id` | Obtener producto por ID | Todos |
| POST | `/products` | Crear nuevo producto | admin, manager |
| PUT | `/products/:id` | Actualizar producto | admin, manager |
| DELETE | `/products/:id` | Eliminar producto | admin |

### Proveedores

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/suppliers` | Obtener todos los proveedores | Todos |
| GET | `/suppliers/:id` | Obtener proveedor por ID | Todos |
| POST | `/suppliers` | Crear nuevo proveedor | admin, manager |
| PUT | `/suppliers/:id` | Actualizar proveedor | admin, manager |
| DELETE | `/suppliers/:id` | Eliminar proveedor | admin |

### Inventario

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/inventory` | Obtener todo el inventario | Todos |
| GET | `/inventory/:id` | Obtener registro por ID | Todos |
| POST | `/inventory` | Crear nuevo registro | admin, manager |
| PUT | `/inventory/:id` | Actualizar registro | admin, manager |
| DELETE | `/inventory/:id` | Eliminar registro | admin |

### Categorías

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/categories` | Obtener todas las categorías | Todos |
| GET | `/categories/:id` | Obtener categoría por ID | Todos |
| POST | `/categories` | Crear nueva categoría | admin, manager |
| PUT | `/categories/:id` | Actualizar categoría | admin, manager |
| DELETE | `/categories/:id` | Eliminar categoría | admin |

### Carrito

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/cart` | Obtener carrito del usuario | Todos |
| POST | `/cart/add` | Agregar producto al carrito | Todos |
| PUT | `/cart/item/:productId` | Actualizar cantidad en carrito | Todos |
| POST | `/cart/apply-discount` | Aplicar descuento al carrito | Todos |
| DELETE | `/cart/remove-discount` | Remover descuento del carrito | Todos |
| DELETE | `/cart/clear` | Vaciar carrito | Todos |
| POST | `/cart/checkout` | Completar compra | Todos |

### Descuentos

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/discounts` | Obtener todos los descuentos | Todos |
| GET | `/discounts/active` | Obtener descuentos activos | Todos |
| GET | `/discounts/:id` | Obtener descuento por ID | Todos |
| GET | `/discounts/code/:code` | Obtener descuento por código | Todos |
| POST | `/discounts` | Crear nuevo descuento | admin |
| PUT | `/discounts/:id` | Actualizar descuento | admin |
| DELETE | `/discounts/:id` | Eliminar descuento | admin |
| POST | `/discounts/validate` | Validar código de descuento | Todos |

### Reseñas

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/reviews` | Obtener todas las reseñas | Todos |
| GET | `/reviews/product/:productId` | Obtener reseñas de un producto | Todos |
| GET | `/reviews/product/:productId/stats` | Estadísticas de reseñas | Todos |
| GET | `/reviews/:id` | Obtener reseña por ID | Todos |
| GET | `/reviews/my/reviews` | Obtener reseñas del usuario | Todos |
| POST | `/reviews` | Crear nueva reseña | Todos |
| PUT | `/reviews/:id` | Actualizar reseña | Propietario |
| DELETE | `/reviews/:id` | Eliminar reseña | Propietario/Admin |

### Ventas

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| POST | `/sales` | Crear nueva venta | Todos |
| GET | `/sales` | Obtener todas las ventas | admin |
| GET | `/sales/my-sales` | Obtener ventas del usuario | Todos |
| GET | `/sales/stats` | Estadísticas de ventas | admin |
| GET | `/sales/date-range` | Ventas por rango de fechas | admin |
| GET | `/sales/:id` | Obtener venta por ID | Todos |
| DELETE | `/sales/:id` | Eliminar venta | admin |

## 🔐 Sistema de Autenticación

### Registro de Usuario

```json
POST /auth/register
{
  "username": "usuario",
  "email": "usuario@email.com",
  "password": "contraseña",
  "roleName": "user" // Opcional: "admin", "manager", "user"
}
```

### Inicio de Sesión

```json
POST /auth/login
{
  "email": "usuario@email.com",
  "password": "contraseña"
}
```

### Respuesta de Autenticación

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "user_id",
    "username": "usuario",
    "email": "usuario@email.com",
    "role": "user"
  }
}
```

### Usuario Administrador por Defecto

Después de ejecutar `npm run seed`, se crea un usuario administrador:
- **Email:** admin@papeleria.com
- **Password:** admin123
- **Rol:** admin

## 👥 Sistema de Roles

- **admin:** Acceso completo a todas las funcionalidades
- **manager:** Puede crear y actualizar registros, pero no eliminar
- **user:** Solo puede leer datos (GET requests)

## 🔒 Middleware de Seguridad

### authenticateToken
Verifica la validez del token JWT en las cookies y agrega el usuario al request.

### requireRole
Verifica que el usuario tenga los roles necesarios para acceder al recurso.

## 📊 Modelos de Datos

### Usuario
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  rol: ObjectId (ref: Role)
}
```

### Rol
```javascript
{
  roleName: String // "admin", "manager", "user"
}
```

### Producto
```javascript
{
  name: String,
  description: String,
  category: ObjectId (ref: Category),
  price: Number,
  image: String,
  suppliers: [ObjectId] (ref: Supplier)
}
```

### Carrito
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    unitPrice: Number
  }],
  totalAmount: Number,
  appliedDiscount: ObjectId (ref: Discount),
  status: String // "active", "completed"
}
```

### Descuento
```javascript
{
  code: String,
  percent: Number,
  active: Boolean
}
```

### Reseña
```javascript
{
  user: ObjectId (ref: User),
  product: ObjectId (ref: Product),
  rating: Number,
  comment: String,
  reviewDate: Date
}
```

### Venta
```javascript
{
  cart: ObjectId (ref: Cart),
  saleDate: Date
}
```

## 🏗️ Scripts Disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Iniciar en producción
npm start

# Ejecutar seed para inicializar base de datos
npm run seed
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno Requeridas

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017` |
| `PORT` | Puerto del servidor | `4000` |
| `JWT_SECRET` | Clave secreta para JWT | - |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |

### Configuración de Cookies

- **httpOnly:** true (seguridad contra XSS)
- **secure:** true en producción
- **sameSite:** strict
- **maxAge:** 24 horas

## 🚨 Manejo de Errores

La API retorna respuestas consistentes:

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

### Códigos de Estado Comunes

- `200` - Éxito
- `201` - Creado
- `400` - Solicitud incorrecta
- `401` - No autorizado
- `403` - Prohibido (sin permisos)
- `404` - No encontrado
- `500` - Error interno del servidor

## 🛒 Funcionalidades de Tienda

### Gestión de Carrito
- **Carrito por usuario**: Cada usuario tiene su propio carrito
- **Gestión de items**: Agregar, actualizar y eliminar productos
- **Cálculo automático**: Total se calcula automáticamente
- **Descuentos aplicables**: Códigos de descuento válidos
- **Checkout integrado**: Proceso de compra completo

### Sistema de Reseñas
- **Calificación 1-5 estrellas**: Sistema de puntuación
- **Comentarios opcionales**: Texto adicional para reseñas
- **Una reseña por producto**: Evita reseñas duplicadas
- **Estadísticas de producto**: Promedio y distribución de calificaciones
- **Gestión de reseñas**: Los usuarios pueden editar/eliminar sus reseñas

### Gestión de Ventas
- **Proceso de venta**: Desde carrito a venta completada
- **Control de stock**: Verificación y actualización automática
- **Estadísticas**: Ventas por período y productos más vendidos
- **Historial de compras**: Usuarios pueden ver sus ventas anteriores
- **Reportes administrativos**: Estadísticas detalladas para administradores

### Sistema de Descuentos
- **Códigos únicos**: Cada código es único y válido una vez
- **Porcentaje configurable**: Descuentos del 0% al 100%
- **Activación/desactivación**: Control de disponibilidad
- **Validación en tiempo real**: Verificación de códigos válidos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un Pull Request

## 👥 Autores

- **Arekkazu** - Desarrollo
- **Daffy** - Desarrollo  
- **MiguelDev** - Desarrollo

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

**🚀 ¡Listo para usar!** El backend está completamente configurado con autenticación JWT, sistema de roles y todas las rutas necesarias para gestionar una papelería.