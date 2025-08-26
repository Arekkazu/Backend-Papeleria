# 📝 Palacio Del Papel - Backend API

Backend API para el sistema de gestión de papelería "Palacio Del Papel". Una solución completa para la gestión de inventario, ventas y administración de una papelería.

## 🚀 Características

- ✅ API RESTful con Express.js
- 🗄️ Base de datos MongoDB con Mongoose
- 🔐 Autenticación y autorización
- 📁 Manejo de archivos con express-fileupload
- 🔒 Encriptación de contraseñas con bcrypt
- 📊 Logging de requests con Morgan
- 🔄 Hot reload con Nodemon
- 🌱 Variables de entorno para configuración

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **bcrypt** - Hashing de contraseñas
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
   cd backend-Palacio-Del-Papel
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   MONGODB_URI=mongodb://localhost:27017/palacio-del-papel
   # o para MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/palacio-del-papel

   PORT=3000
   ```

4. **Iniciar la aplicación**

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
backend-Palacio-Del-Papel/
├── src/
│   ├── app.js              # Punto de entrada de la aplicación
│   ├── server.js           # Configuración del servidor Express
│   ├── config/             # Configuraciones de la aplicación
│   ├── controller/         # Controladores de la API
│   │   └── index.controller.js
│   ├── data/               # Configuración de base de datos
│   │   └── mongoose.js
│   └── routes/             # Definición de rutas
│       ├── routes.js
│       └── index.routes.js
├── .env                    # Variables de entorno (no incluido en git)
├── nodemon.json           # Configuración de Nodemon
├── package.json           # Dependencias y scripts
└── README.md              # Este archivo
```

## 🔌 API Endpoints

### Rutas Base

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/`      | Mensaje de bienvenida |



## 🏗️ Convenciones de Desarrollo

### Estilo de Código

- **ES6 Modules**: Usar `import/export` en lugar de `require/module.exports`
- **Manejo de Promesas**: En controladores, usar `.then().catch()` para operaciones asíncronas en lugar de `async/await`
- **Naming Conventions**:
  - Variables y funciones: `camelCase`
  - Constantes: `UPPER_SNAKE_CASE`
  - Archivos: `kebab-case.js` o `camelCase.js`
  - Controladores: `PascalCase` para objetos exportados

### Estructura de Archivos

```javascript
// Ejemplo de controlador
export const ProductController = {
  getAll: (req, res) => {
    // Usar .then().catch() en controladores
    someAsyncOperation()
      .then(data => {
        res.status(200).json({ data });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  }
};
```

```javascript
// Ejemplo de ruta
import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";

const router = Router();
router.get("/products", ProductController.getAll);

export default router;
```

### Manejo de Errores

- En controladores: usar `.then().catch()` para manejar promesas
- Retornar responses consistentes con status codes apropiados
- Loggear errores para debugging

### Base de Datos

- Usar Mongoose para modelado de datos
- Definir esquemas claros con validaciones
- Usar transacciones cuando sea necesario

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un Pull Request

### Reglas de Commit

- Usar commits descriptivos en español
- Formato: `tipo: descripción`
  - `feat:` nueva funcionalidad
  - `fix:` corrección de bug
  - `docs:` documentación
  - `style:` cambios de formato
  - `refactor:` refactorización de código


## 📝 Scripts Disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Iniciar en producción
npm start


```

## 🔐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/papeleria` |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` o `production` |

## 👥 Autores

- **Arekkazu** - Desarrollo
- **Daffy** - Desarrollo
- **MiguelDev** - Desarrollo

---
