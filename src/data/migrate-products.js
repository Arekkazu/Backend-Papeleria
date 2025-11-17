import mongoose from "mongoose";
import { Product } from "./schema/products.schema.js";
import { Category } from "./schema/categories.schema.js";
import "dotenv/config";

// Productos del frontend
const productos = [
  {
    name: "Cuaderno Norma",
    categoryName: "Escolar",
    price: 6500,
    image: "https://cdn1.totalcommerce.cloud/normaco/product-image/es/cuaderno-argollado-tapa-dura-grande-multimateria-7m-cuadriculado-academico-rojo-1.webp",
    description: "Cuaderno argollado tapa dura grande multimateria 7m cuadriculado académico"
  },
  {
    name: "Bolígrafo BIC",
    categoryName: "Escolar",
    price: 1200,
    image: "https://comercialpapelera.com.co/tienda/13015-large_default/boligrafo-bic-needle-clasico-x4-und.jpg",
    description: "Bolígrafo BIC Needle clásico x4 unidades"
  },
  {
    name: "Resma de papel carta",
    categoryName: "Papeles y Formatos",
    price: 18000,
    image: "https://cdnx.jumpseller.com/la-cali/image/9036718/7702148000043_resma_carta_blanca_1.jpg?1658954704",
    description: "Resma de papel carta blanca, 500 hojas"
  },
  {
    name: "Archivador AZ",
    categoryName: "Archivado y Organización",
    price: 9500,
    image: "https://www.papeleriaelmayorista.com/wp-content/uploads/legajador-az-economico-carta-oficio.jpg",
    description: "Legajador AZ económico carta/oficio"
  },
  {
    name: "Marcadores Sharpie",
    categoryName: "Arte y Dibujo Técnico",
    price: 22000,
    image: "https://panamericana.vtexassets.com/arquivos/ids/383487/marcador-permanente-sharpie-fino-por-8-basicos-5401178077408.jpg?v=637494408663200000",
    description: "Marcador permanente Sharpie fino por 8 básicos"
  },
  {
    name: "Corrector líquido Pelikan",
    categoryName: "Adhesivos y Corrección",
    price: 3500,
    image: "https://tuexpres.com/web/image/product.image/2719/image_1024/Corrector%20liquido%20tipo%20boligrafo%20de%207ml%20Pelikan%2012u?unique=2004400",
    description: "Corrector líquido tipo bolígrafo de 7ml Pelikan"
  },
  {
    name: "Tijeras escolares",
    categoryName: "Escolar",
    price: 2500,
    image: "https://megadistribuciones.co/wp-content/uploads/2021/10/MEGADISTRIBUCIONES-WEB-8.webp",
    description: "Tijeras escolares punta redonda"
  },
  {
    name: "Cinta adhesiva",
    categoryName: "Adhesivos y Corrección",
    price: 1800,
    image: "https://comercialpapelera.com.co/tienda/3679-large_default/cinta-transparente-48mx100m.jpg",
    description: "Cinta transparente 48mm x 100m"
  },
  {
    name: "Carpeta plástica",
    categoryName: "Archivado y Organización",
    price: 3200,
    image: "https://panamericana.vtexassets.com/arquivos/ids/287738-800-auto?v=636578389762300000&width=800&height=auto&aspect=true",
    description: "Carpeta plástica con gancho, tamaño carta"
  },
  {
    name: "Lápices de colores",
    categoryName: "Arte y Dibujo Técnico",
    price: 7800,
    image: "https://panamericana.vtexassets.com/arquivos/ids/360195/colores-faber-castell-supersoft-x-50-unidades-7891360654124.jpg?v=637346503820430000",
    description: "Colores Faber-Castell Supersoft x50 unidades"
  }
];

const migrateProducts = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "Papeleria" });
    console.log("📡 Conectado a la base de datos");

    // Opcional: Limpiar productos existentes
    console.log("🗑️  Limpiando productos existentes...");
    await Product.deleteMany({});

    // Crear categorías si no existen
    const categoriasUnicas = [...new Set(productos.map(p => p.categoryName))];
    
    console.log("📋 Creando categorías...");
    for (const catName of categoriasUnicas) {
      const existingCat = await Category.findOne({ name: catName });
      if (!existingCat) {
        await Category.create({
          name: catName,
          description: `Categoría de ${catName}`
        });
        console.log(`✅ Categoría '${catName}' creada`);
      } else {
        console.log(`ℹ️  Categoría '${catName}' ya existe`);
      }
    }

    // Insertar productos
    console.log("\n📦 Migrando productos del JSON...");
    let contador = 0;

    for (const productoData of productos) {
      // Buscar la categoría
      const categoria = await Category.findOne({ name: productoData.categoryName });

      const producto = {
        name: productoData.name,
        categoryName: productoData.categoryName,
        category: categoria ? categoria._id : null,
        price: productoData.price,
        image: productoData.image,
        description: productoData.description || `Producto ${productoData.name}`,
      };

      await Product.create(producto);
      contador++;
      console.log(`✅ [${contador}/${productos.length}] '${producto.name}' migrado`);
    }

    console.log("\n🎉 Migración completada exitosamente!");
    console.log(`📊 Total de productos migrados: ${contador}`);

    // Mostrar resumen
    const totalProductos = await Product.countDocuments();
    const totalCategorias = await Category.countDocuments();
    console.log(`\n📈 Resumen:`);
    console.log(`   - Productos en BD: ${totalProductos}`);
    console.log(`   - Categorías en BD: ${totalCategorias}`);

  } catch (error) {
    console.error("❌ Error en la migración:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
    process.exit(0);
  }
};

// Ejecutar migración
migrateProducts();
