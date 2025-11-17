# 🧪 Guía de Pruebas - Gestión de Inventario

## 📋 Resumen de Funcionalidad

El sistema ahora tiene **validación completa de stock** y **descuento automático de inventario** al completar compras.

---

## ✅ Funcionalidades Implementadas

### 1. **Validación de Stock al Agregar al Carrito**
- ✅ Verifica stock disponible antes de agregar
- ✅ Valida suma de cantidades si el producto ya está en el carrito
- ✅ Muestra mensaje de error con stock disponible

### 2. **Validación al Actualizar Cantidad**
- ✅ Verifica que la nueva cantidad no exceda el stock
- ✅ Muestra alerta visual al usuario

### 3. **Validación al Finalizar Compra (Checkout)**
- ✅ Valida stock de TODOS los productos antes de completar
- ✅ Rechaza la compra si algún producto no tiene stock suficiente
- ✅ **Descuenta automáticamente del inventario** al completar
- ✅ Crea nuevo carrito vacío después del checkout exitoso

---

## 🧪 Casos de Prueba

### **Caso 1: Agregar Producto con Stock Suficiente**

**Pasos:**
1. Ir a página de productos
2. Seleccionar un producto (ej: "Cuaderno Norma")
3. Click en "Añadir" o "Agregar al carrito"

**Resultado Esperado:**
- ✅ Producto agregado al carrito
- ✅ Mensaje de éxito
- ✅ Sin errores

---

### **Caso 2: Agregar Más del Stock Disponible**

**Pasos:**
1. Verificar stock de un producto en Admin → Productos (ej: 77 unidades)
2. Ir al detalle del producto
3. Cambiar cantidad a 100 (mayor que el stock)
4. Click en "Agregar al carrito"

**Resultado Esperado:**
- ❌ Aparece alerta roja: "Stock insuficiente. Solo hay 77 unidades disponibles."
- ❌ Producto NO se agrega al carrito
- ✅ Sin errores en la consola

---

### **Caso 3: Agregar Producto Ya en el Carrito (Suma Excede Stock)**

**Escenario:**
- Stock disponible: 5 unidades
- Ya en carrito: 3 unidades

**Pasos:**
1. Agregar 3 unidades del producto al carrito
2. Intentar agregar 3 más (total sería 6)

**Resultado Esperado:**
- ❌ Alerta: "Stock insuficiente. Solo hay 5 unidades disponibles."
- ✅ Carrito mantiene las 3 unidades originales

---

### **Caso 4: Actualizar Cantidad en el Carrito**

**Pasos:**
1. Ir al carrito con un producto agregado
2. Cambiar la cantidad en el campo de texto a más del stock disponible
3. Presionar Enter o hacer blur

**Resultado Esperado:**
- ❌ Alerta emergente: "Stock insuficiente. Solo hay X unidades disponibles."
- ✅ Cantidad NO se actualiza

---

### **Caso 5: Checkout Exitoso**

**Pasos:**
1. Agregar productos al carrito (con cantidades válidas)
2. Ir al carrito
3. Click en "Finalizar Compra"

**Resultado Esperado:**
- ✅ Mensaje: "Compra completada exitosamente"
- ✅ Modal de checkout exitoso
- ✅ Carrito se vacía
- ✅ **Inventario se descuenta automáticamente**
- ✅ Se crea nuevo carrito vacío

**Verificación:**
1. Ir a Admin → Productos
2. Verificar que el stock se haya descontado correctamente

---

### **Caso 6: Checkout con Stock Insuficiente**

**Escenario:**
- Producto A en carrito: 10 unidades
- Stock real en DB: 5 unidades (modificado después de agregarlo)

**Pasos:**
1. Agregar 10 unidades cuando había stock
2. Modificar el stock manualmente en la BD a 5
3. Intentar finalizar compra

**Resultado Esperado:**
- ❌ Alerta roja: "Stock insuficiente para [Nombre]. Solo hay 5 unidades disponibles."
- ❌ Compra NO se procesa
- ✅ Carrito mantiene los productos
- ✅ Inventario NO se modifica

---

## 🔍 Verificación de Inventario

### **Antes de la Compra:**
```bash
# Conectar a MongoDB
mongosh

use Papeleria

# Ver inventario de un producto
db.inventory.find({ product: ObjectId("ID_DEL_PRODUCTO") })
```

**Ejemplo de salida:**
```json
{
  "_id": ObjectId("..."),
  "product": ObjectId("..."),
  "stock": 77,
  "lastUpdated": ISODate("2025-11-17T...")
}
```

### **Después de la Compra:**
```bash
# Verificar que el stock se descontó
db.inventory.find({ product: ObjectId("ID_DEL_PRODUCTO") })
```

**Ejemplo de salida (compró 5 unidades):**
```json
{
  "_id": ObjectId("..."),
  "product": ObjectId("..."),
  "stock": 72,  // ← 77 - 5 = 72
  "lastUpdated": ISODate("2025-11-17T...") // ← Actualizado
}
```

---

## 📊 Logs del Backend

Al realizar checkout, deberías ver en los logs del backend:

```
POST /cart/checkout 200 X.XXX ms
```

Si hay error de stock:
```
POST /cart/checkout 400 X.XXX ms
```

---

## 🐛 Solución de Problemas

### **Problema: Stock no se descuenta**

**Causa Probable:** Frontend no está llamando al endpoint de checkout

**Solución:**
1. Verificar que `cartService.checkout()` se esté llamando en `handleFinish`
2. Revisar Network tab del navegador
3. Debe haber una petición POST a `/cart/checkout`

---

### **Problema: Error "Inventario no encontrado"**

**Causa:** No hay registro de inventario para el producto

**Solución:**
```javascript
// Ejecutar seed nuevamente
cd Backend-Papeleria
node src/data/seed.js
```

Esto creará inventario para todos los productos.

---

### **Problema: Aparecen errores en la consola**

**Causa:** Errores de validación mostrándose como logs

**Solución:** Ya implementado - solo se muestran errores inesperados, no validaciones de stock.

---

## 📝 Endpoints Relevantes

### **GET /cart**
- Obtener carrito del usuario autenticado

### **POST /cart/add**
```json
{
  "productId": "67xxxxx",
  "quantity": 5
}
```
- Validación de stock ✅

### **PUT /cart/item/:productId**
```json
{
  "quantity": 10
}
```
- Validación de stock ✅

### **POST /cart/checkout**
- Valida stock de todos los productos ✅
- Descuenta del inventario ✅
- Marca carrito como completado ✅
- Crea nuevo carrito vacío ✅

---

## 🎯 Checklist de Validación

- [ ] Stock se valida al agregar producto
- [ ] Stock se valida al actualizar cantidad
- [ ] Mensajes de error son claros y visibles
- [ ] No aparecen errores de validación en consola
- [ ] Checkout valida stock antes de procesar
- [ ] Inventario se descuenta correctamente al completar compra
- [ ] Se crea nuevo carrito después de checkout
- [ ] Usuario puede seguir comprando después de checkout exitoso
- [ ] Alertas visuales (Snackbar) funcionan correctamente

---

## 💡 Datos de Prueba

### Productos del Seed:

1. **Cuaderno Norma** - $6,500
2. **Bolígrafo BIC** - $1,200
3. **Resma de papel carta** - $18,000
4. **Archivador AZ** - $9,500
5. **Marcadores Sharpie** - $22,000
6. **Corrector líquido Pelikan** - $3,500
7. **Tijeras escolares** - $2,500
8. **Cinta adhesiva** - $1,800
9. **Carpeta plástica** - $3,200
10. **Lápices de colores** - $7,800

**Stock inicial:** Aleatorio entre 20 y 120 unidades

---

## ✅ Prueba Completa (End-to-End)

### **Escenario Completo:**

1. **Preparación:**
   - Ejecutar seed para tener datos limpios
   - Iniciar sesión como usuario normal

2. **Agregar Productos:**
   - Agregar "Cuaderno Norma" (5 unidades)
   - Agregar "Bolígrafo BIC" (10 unidades)
   - Verificar que ambos están en el carrito

3. **Intentar Exceder Stock:**
   - Buscar producto con stock bajo
   - Intentar agregar más del disponible
   - ✅ Verificar alerta de error

4. **Modificar Cantidades:**
   - En el carrito, cambiar cantidad
   - Intentar cantidad mayor al stock
   - ✅ Verificar alerta

5. **Checkout:**
   - Click en "Finalizar Compra"
   - ✅ Esperar confirmación de éxito
   - ✅ Verificar que el carrito se vacía

6. **Verificación:**
   - Ir a Admin → Productos
   - ✅ Verificar que el stock se descontó correctamente
   - ✅ Stock de Cuaderno Norma: original - 5
   - ✅ Stock de Bolígrafo BIC: original - 10

---

**¡Sistema de inventario completamente funcional!** 🎉