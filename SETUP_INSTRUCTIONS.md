# Instrucciones de Configuración - Backend Papelería

## ✅ Estado Actual

El backend ya está completamente configurado y la base de datos ha sido poblada con datos de prueba.

## 📋 Resumen de Configuración

### 1. Variables de Entorno (.env)

El archivo `.env` ya está creado con la siguiente configuración:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/Papeleria

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion_123456
JWT_EXPIRES_IN=24h
```

### 2. Base de Datos

La base de datos MongoDB ya fue poblada con el seed exitosamente. Contiene:

- ✅ **3 Roles**: admin, manager, user
- ✅ **4 Usuarios**: incluyendo admin
- ✅ **5 Categorías**: 
  - Escolar
  - Papeles y Formatos
  - Archivado y Organización
  - Arte y Dibujo Técnico
  - Adhesivos y Corrección
- ✅ **4 Proveedores**
- ✅ **10 Productos con inventario**:
  1. Cuaderno Norma - $6,500
  2. Bolígrafo BIC - $1,200
  3. Resma de papel carta - $18,000
  4. Archivador AZ - $9,500
  5. Marcadores Sharpie - $22,000
  6. Corrector líquido Pelikan - $3,500
  7. Tijeras escolares - $2,500
  8. Cinta adhesiva - $1,800
  9. Carpeta plástica - $3,200
  10. Lápices de colores - $7,800
- ✅ **5 Descuentos**
- ✅ **4 Reseñas**
- ✅ **2 Carritos de prueba**
- ✅ **2 Ventas de prueba**

## 🚀 Cómo Iniciar el Backend

### Opción 1: Con nodemon (desarrollo)
```bash
cd Backend-Papeleria
npm run dev
```

### Opción 2: Con node
```bash
cd Backend-Papeleria
npm start
```

El servidor estará corriendo en: `http://localhost:3000`

## 🔑 Usuario Administrador

Para acceder al sistema como administrador:

- **Email**: admin@papeleria.com
- **Password**: admin123

## 📡 Endpoints Disponibles

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/verify` - Verificar autenticación

### Productos (Públicos)
- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener producto por ID

### Carrito (Requiere autenticación)
- `GET /cart` - Obtener carrito del usuario
- `POST /cart/add` - Agregar producto al carrito
- `PUT /cart/item/:productId` - Actualizar cantidad
- `DELETE /cart/clear` - Vaciar carrito
- `POST /cart/checkout` - Finalizar compra

### Descuentos
- `GET /discounts/active` - Obtener descuentos activos
- `POST /discounts/validate` - Validar código de descuento

### Administración (Requiere rol admin/manager)
- `GET /admin/stats` - Estadísticas del dashboard
- `GET /admin/users` - Gestión de usuarios
- `GET /admin/products` - Gestión de productos
- `GET /admin/categories` - Gestión de categorías
- `GET /admin/suppliers` - Gestión de proveedores

## 🔄 Re-ejecutar el Seed

Si necesitas resetear la base de datos:

```bash
cd Backend-Papeleria
node src/data/seed.js
```

⚠️ **Advertencia**: Esto eliminará TODOS los datos existentes y creará datos de prueba nuevos.

## 🧪 Probar el Backend

### Verificar que el servidor está corriendo:
```bash
curl http://localhost:3000/products
```

Deberías ver una respuesta JSON con 10 productos.

### Probar login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@papeleria.com","password":"admin123"}'
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB esté corriendo: `sudo systemctl status mongod`
- Inicia MongoDB si no está corriendo: `sudo systemctl start mongod`

### Error: "Port 3000 is already in use"
- Cambia el puerto en el archivo `.env`
- O detén el proceso que está usando el puerto: `lsof -ti:3000 | xargs kill -9`

### Error: "JWT_SECRET must have a value"
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que contiene la variable `JWT_SECRET`

## 📝 Notas de Seguridad

⚠️ **IMPORTANTE para Producción**:

1. Cambia el `JWT_SECRET` por uno más seguro:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. Actualiza `NODE_ENV=production` en el archivo `.env`

3. Cambia las contraseñas de los usuarios de prueba

4. Configura variables de entorno en tu servidor de producción (no uses el archivo `.env` en producción)