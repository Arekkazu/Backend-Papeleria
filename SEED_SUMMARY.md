# 📊 Resumen del Seed - Backend Papelería

## 🎯 Propósito
Este documento describe los datos de ejemplo que se han poblado en la base de datos mediante el script de seed, proporcionando una base completa para el desarrollo y testing del sistema.

## 📋 Datos Creados

### 👥 Roles del Sistema
| Rol | Descripción |
|-----|-------------|
| `admin` | Acceso completo a todas las funcionalidades |
| `manager` | Puede crear y actualizar, pero no eliminar |
| `user` | Acceso básico de lectura y compras |

### 👤 Usuarios de Prueba
| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| admin | admin@papeleria.com | admin123 | admin |
| gerente | gerente@papeleria.com | gerente123 | manager |
| cliente1 | cliente1@email.com | cliente123 | user |
| cliente2 | cliente2@email.com | cliente123 | user |

### 📂 Categorías de Productos
1. **Papelería** - Artículos de papelería en general
2. **Escritura** - Bolígrafos, lápices, marcadores
3. **Oficina** - Material de oficina
4. **Arte** - Materiales artísticos
5. **Escolar** - Material escolar
6. **Archivado** - Archivadores y organizadores

### 🏢 Proveedores
| Empresa | Email | Teléfono |
|---------|-------|----------|
| Papelera Central | ventas@papeleracentral.com | +1234567890 |
| Distribuidora Escolar | contacto@distribuidora.com | +0987654321 |
| Arte y Diseño SA | info@arteydiseno.com | +1122334455 |
| Oficina Moderna | ventas@oficinamoderna.com | +5566778899 |

### 🛍️ Productos con Inventario
| Producto | Categoría | Precio | Stock |
|----------|-----------|--------|-------|
| Cuaderno Universitario | Papelería | $15.99 | 20-120 |
| Bolígrafo BIC Azul | Escritura | $12.50 | 20-120 |
| Resaltador Amarillo | Escritura | $8.75 | 20-120 |
| Grapadora Metálica | Oficina | $25.99 | 20-120 |
| Block de Dibujo A4 | Arte | $18.50 | 20-120 |
| Tijeras Escolares | Escolar | $9.50 | 20-120 |
| Cinta Adhesiva | Oficina | $6.80 | 20-120 |
| Carpeta Plástica | Oficina | $7.20 | 20-120 |
| Lápices de Colores x24 | Arte | $32.00 | 20-120 |
| Resma de Papel Carta | Papelería | $22.00 | 20-120 |

### 🎫 Descuentos Disponibles
| Código | Porcentaje | Estado |
|--------|------------|--------|
| BIENVENIDA10 | 10% | Activo |
| VERANO20 | 20% | Activo |
| OFICINA15 | 15% | Inactivo |
| ESCOLAR25 | 25% | Activo |
| ARTE30 | 30% | Activo |

### 📝 Reseñas de Productos
- **cliente1** → Cuaderno Universitario: ⭐⭐⭐⭐⭐ "Excelente calidad, muy resistente"
- **cliente2** → Bolígrafo BIC: ⭐⭐⭐⭐ "Buena relación calidad-precio"
- **cliente1** → Block de Dibujo: ⭐⭐⭐⭐⭐ "Perfecto para mis proyectos de arte"
- **cliente2** → Cinta Adhesiva: ⭐⭐⭐ "Funciona bien, pero se podría mejorar"

### 🛒 Carritos Activos
- **cliente1**: 2x Cuaderno + 1x Bolígrafo
- **cliente2**: 2x Cuaderno + 1x Bolígrafo

### 💰 Ventas Históricas
- 2 ventas completadas en los últimos 7 días
- Una por cada usuario cliente

## 🔧 Características del Seed

### ✅ Datos Realistas
- Precios en rangos realistas del mercado
- Imágenes reales de productos
- Stock variado entre 20-120 unidades
- Relaciones entre entidades bien definidas

### 🔄 Estado del Sistema
- **Usuarios autenticados**: 4
- **Productos disponibles**: 10
- **Categorías organizadas**: 6
- **Proveedores activos**: 4
- **Descuentos aplicables**: 4 activos
- **Inventario gestionado**: Sí

### 🎯 Casos de Uso Cubiertos

#### Para Desarrolladores
1. **Testing de autenticación** con múltiples roles
2. **Pruebas de productos** con categorías reales
3. **Flujos de compra** completos
4. **Gestión de inventario** automática
5. **Sistema de descuentos** funcional

#### Para Administradores
1. **Gestión de usuarios** con diferentes permisos
2. **Control de productos** y categorías
3. **Monitoreo de ventas** e inventario
4. **Configuración de descuentos**

#### Para Usuarios Finales
1. **Experiencia de compra** completa
2. **Sistema de reseñas** funcional
3. **Aplicación de descuentos**
4. **Historial de compras**

## 🚀 Ejecución del Seed

```bash
# Ejecutar seed completo
npm run seed

# Resultado esperado
📊 Resumen de datos creados:
   - Roles: 3 (admin, manager, user)
   - Usuarios: 4 (incluyendo admin)
   - Categorías: 6
   - Proveedores: 4
   - Productos: 10 con inventario
   - Descuentos: 5
   - Reseñas: 4
   - Carritos: 2
   - Ventas: 2
```

## 📝 Notas Importantes

1. **Contraseñas**: Todas las contraseñas están hasheadas con bcrypt
2. **Inventario**: Stock generado aleatoriamente entre 20-120 unidades
3. **Imágenes**: URLs reales de productos existentes
4. **Relaciones**: Todas las referencias entre entidades están correctamente establecidas
5. **Fechas**: Ventas con fechas distribuidas en los últimos 7 días

## 🔄 Re-ejecución
El seed limpia todos los datos existentes antes de crear nuevos, asegurando un estado limpio y consistente en cada ejecución.

---
**Estado**: ✅ Completado  
**Última actualización**: $(date)  
**Base de datos**: MongoDB - Papeleria