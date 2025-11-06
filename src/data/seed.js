import mongoose from "mongoose";
import { Role } from "./schema/roles.schemas.js";
import { User } from "./schema/users.schemas.js";
import { Category } from "./schema/categories.schema.js";
import { Product } from "./schema/products.schema.js";
import { Supplier } from "./schema/suppliers.schema.js";
import { Inventory } from "./schema/inventory.schema.js";
import { Discount } from "./schema/discounts.schema.js";
import { Cart } from "./schema/cart.schema.js";
import { Review } from "./schema/review.schema.js";
import { Sale } from "./schema/sales.schema.js";
import bcrypt from "bcrypt";
import "dotenv/config";

const seedRoles = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "Papeleria" });
    console.log("📡 Conectado a la base de datos");

    // Limpiar datos existentes (opcional - comentar si no quieres borrar datos existentes)
    console.log("🗑️  Limpiando datos existentes...");
    await Role.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    await Inventory.deleteMany({});
    await Discount.deleteMany({});
    await Cart.deleteMany({});
    await Review.deleteMany({});
    await Sale.deleteMany({});

    // Crear roles por defecto
    const defaultRoles = [
      { roleName: "admin" },
      { roleName: "manager" },
      { roleName: "user" },
    ];

    // Insertar roles
    for (const roleData of defaultRoles) {
      await Role.create(roleData);
      console.log(`✅ Rol '${roleData.roleName}' creado`);
    }

    console.log("🎉 Seed de roles completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de roles:", error);
  }
};

const seedUsers = async () => {
  try {
    const adminRole = await Role.findOne({ roleName: "admin" });
    const managerRole = await Role.findOne({ roleName: "manager" });
    const userRole = await Role.findOne({ roleName: "user" });

    // Crear usuarios de ejemplo
    const users = [
      {
        username: "admin",
        email: "admin@papeleria.com",
        password: await bcrypt.hash("admin123", 12),
        rol: adminRole._id,
      },
      {
        username: "gerente",
        email: "gerente@papeleria.com",
        password: await bcrypt.hash("gerente123", 12),
        rol: managerRole._id,
      },
      {
        username: "cliente1",
        email: "cliente1@email.com",
        password: await bcrypt.hash("cliente123", 12),
        rol: userRole._id,
      },
      {
        username: "cliente2",
        email: "cliente2@email.com",
        password: await bcrypt.hash("cliente123", 12),
        rol: userRole._id,
      },
    ];

    for (const userData of users) {
      await User.create(userData);
      console.log(`✅ Usuario '${userData.username}' creado`);
    }

    console.log("🎉 Seed de usuarios completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de usuarios:", error);
  }
};

const seedCategories = async () => {
  try {
    const categories = [
      { name: "Papelería", description: "Artículos de papelería en general" },
      { name: "Escritura", description: "Bolígrafos, lápices, marcadores" },
      { name: "Oficina", description: "Material de oficina" },
      { name: "Arte", description: "Materiales artísticos" },
      { name: "Escolar", description: "Material escolar" },
      { name: "Archivado", description: "Archivadores y organizadores" },
    ];

    for (const categoryData of categories) {
      await Category.create(categoryData);
      console.log(`✅ Categoría '${categoryData.name}' creada`);
    }

    console.log("🎉 Seed de categorías completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de categorías:", error);
  }
};

const seedSuppliers = async () => {
  try {
    const suppliers = [
      {
        companyName: "Papelera Central",
        email: "ventas@papeleracentral.com",
        phone: "+1234567890",
      },
      {
        companyName: "Distribuidora Escolar",
        email: "contacto@distribuidora.com",
        phone: "+0987654321",
      },
      {
        companyName: "Arte y Diseño SA",
        email: "info@arteydiseno.com",
        phone: "+1122334455",
      },
      {
        companyName: "Oficina Moderna",
        email: "ventas@oficinamoderna.com",
        phone: "+5566778899",
      },
    ];

    for (const supplierData of suppliers) {
      await Supplier.create(supplierData);
      console.log(`✅ Proveedor '${supplierData.companyName}' creado`);
    }

    console.log("🎉 Seed de proveedores completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de proveedores:", error);
  }
};

const seedProducts = async () => {
  try {
    const papeleriaCategory = await Category.findOne({ name: "Papelería" });
    const escrituraCategory = await Category.findOne({ name: "Escritura" });
    const oficinaCategory = await Category.findOne({ name: "Oficina" });
    const arteCategory = await Category.findOne({ name: "Arte" });
    const escolarCategory = await Category.findOne({ name: "Escolar" });

    const papeleraCentral = await Supplier.findOne({
      companyName: "Papelera Central",
    });
    const distribuidoraEscolar = await Supplier.findOne({
      companyName: "Distribuidora Escolar",
    });
    const arteDiseno = await Supplier.findOne({
      companyName: "Arte y Diseño SA",
    });
    const oficinaModerna = await Supplier.findOne({
      companyName: "Oficina Moderna",
    });

    const products = [
      {
        name: "Cuaderno Universitario",
        description: "Cuaderno de 100 hojas rayadas, tapa dura",
        category: papeleriaCategory._id,
        price: 15.99,
        image:
          "https://cdn1.totalcommerce.cloud/normaco/product-image/es/cuaderno-argollado-tapa-dura-grande-multimateria-7m-cuadriculado-academico-rojo-1.webp",
        suppliers: [papeleraCentral._id, distribuidoraEscolar._id],
      },
      {
        name: "Bolígrafo BIC Azul",
        description: "Bolígrafo de tinta azul punta media, pack de 4",
        category: escrituraCategory._id,
        price: 12.5,
        image:
          "https://comercialpapelera.com.co/tienda/13015-large_default/boligrafo-bic-needle-clasico-x4-und.jpg",
        suppliers: [papeleraCentral._id],
      },
      {
        name: "Resaltador Amarillo",
        description: "Marcador resaltador color amarillo fluorescente",
        category: escrituraCategory._id,
        price: 8.75,
        image:
          "https://panamericana.vtexassets.com/arquivos/ids/383487/marcador-permanente-sharpie-fino-por-8-basicos-5401178077408.jpg?v=637494408663200000",
        suppliers: [distribuidoraEscolar._id],
      },
      {
        name: "Grapadora Metálica",
        description: "Grapadora metálica para oficina, capacidad 20 hojas",
        category: oficinaCategory._id,
        price: 25.99,
        image:
          "https://panamericana.vtexassets.com/arquivos/ids/287738-800-auto?v=636578389762300000&width=800&height=auto&aspect=true",
        suppliers: [papeleraCentral._id, oficinaModerna._id],
      },
      {
        name: "Block de Dibujo A4",
        description: "Block de hojas para dibujo artístico, 50 hojas",
        category: arteCategory._id,
        price: 18.5,
        image:
          "https://panamericana.vtexassets.com/arquivos/ids/360195/colores-faber-castell-supersoft-x-50-unidades-7891360654124.jpg?v=637346503820430000",
        suppliers: [arteDiseno._id],
      },
      {
        name: "Tijeras Escolares",
        description: "Tijeras escolares de acero inoxidable, punta redonda",
        category: escolarCategory._id,
        price: 9.5,
        image:
          "https://megadistribuciones.co/wp-content/uploads/2021/10/MEGADISTRIBUCIONES-WEB-8.webp",
        suppliers: [distribuidoraEscolar._id],
      },
      {
        name: "Cinta Adhesiva",
        description: "Cinta adhesiva transparente, 48mm x 100m",
        category: oficinaCategory._id,
        price: 6.8,
        image:
          "https://comercialpapelera.com.co/tienda/3679-large_default/cinta-transparente-48mx100m.jpg",
        suppliers: [papeleraCentral._id, oficinaModerna._id],
      },
      {
        name: "Carpeta Plástica",
        description: "Carpeta plástica con gancho, tamaño carta",
        category: oficinaCategory._id,
        price: 7.2,
        image:
          "https://panamericana.vtexassets.com/arquivos/ids/287738-800-auto?v=636578389762300000&width=800&height=auto&aspect=true",
        suppliers: [oficinaModerna._id],
      },
      {
        name: "Lápices de Colores x24",
        description: "Set de 24 lápices de colores profesionales",
        category: arteCategory._id,
        price: 32.0,
        image:
          "https://panamericana.vtexassets.com/arquivos/ids/360195/colores-faber-castell-supersoft-x-50-unidades-7891360654124.jpg?v=637346503820430000",
        suppliers: [arteDiseno._id],
      },
      {
        name: "Resma de Papel Carta",
        description: "Resma de papel bond blanco, 500 hojas",
        category: papeleriaCategory._id,
        price: 22.0,
        image:
          "https://cdnx.jumpseller.com/la-cali/image/9036718/7702148000043_resma_carta_blanca_1.jpg?1658954704",
        suppliers: [papeleraCentral._id],
      },
    ];

    for (const productData of products) {
      const product = await Product.create(productData);
      console.log(`✅ Producto '${productData.name}' creado`);

      // Crear inventario para el producto
      await Inventory.create({
        product: product._id,
        stock: Math.floor(Math.random() * 100) + 20, // Stock entre 20 y 120
      });
    }

    console.log("🎉 Seed de productos e inventario completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de productos:", error);
  }
};

const seedDiscounts = async () => {
  try {
    const discounts = [
      { code: "BIENVENIDA10", percent: 10, active: true },
      { code: "VERANO20", percent: 20, active: true },
      { code: "OFICINA15", percent: 15, active: false },
      { code: "ESCOLAR25", percent: 25, active: true },
      { code: "ARTE30", percent: 30, active: true },
    ];

    for (const discountData of discounts) {
      await Discount.create(discountData);
      console.log(`✅ Descuento '${discountData.code}' creado`);
    }

    console.log("🎉 Seed de descuentos completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de descuentos:", error);
  }
};

const seedReviews = async () => {
  try {
    const users = await User.find({});
    const products = await Product.find({});

    if (users.length > 0 && products.length > 0) {
      const reviews = [
        {
          user: users[2]._id, // cliente1
          product: products[0]._id, // Cuaderno Universitario
          rating: 5,
          comment: "Excelente calidad, muy resistente",
        },
        {
          user: users[3]._id, // cliente2
          product: products[1]._id, // Bolígrafo BIC
          rating: 4,
          comment: "Buena relación calidad-precio",
        },
        {
          user: users[2]._id,
          product: products[4]._id, // Block de Dibujo
          rating: 5,
          comment: "Perfecto para mis proyectos de arte",
        },
        {
          user: users[3]._id,
          product: products[6]._id, // Cinta Adhesiva
          rating: 3,
          comment: "Funciona bien, pero se podría mejorar",
        },
      ];

      for (const reviewData of reviews) {
        await Review.create(reviewData);
        console.log(`✅ Reseña para producto creada`);
      }
    }

    console.log("🎉 Seed de reseñas completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de reseñas:", error);
  }
};

const seedCarts = async () => {
  try {
    const users = await User.find({
      rol: (await Role.findOne({ roleName: "user" }))._id,
    });
    const products = await Product.find().limit(3);

    if (users.length > 0 && products.length > 0) {
      for (const user of users) {
        const cart = await Cart.create({
          user: user._id,
          items: [
            {
              product: products[0]._id,
              quantity: 2,
              unitPrice: products[0].price,
            },
            {
              product: products[1]._id,
              quantity: 1,
              unitPrice: products[1].price,
            },
          ],
          totalAmount: products[0].price * 2 + products[1].price,
          status: "active",
        });
        console.log(`✅ Carrito para usuario '${user.username}' creado`);
      }
    }

    console.log("🎉 Seed de carritos completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de carritos:", error);
  }
};

const seedSales = async () => {
  try {
    const carts = await Cart.find({ status: "active" }).populate("user");

    if (carts.length > 0) {
      for (const cart of carts) {
        const sale = await Sale.create({
          cart: cart._id,
          saleDate: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          ), // Ventas de los últimos 7 días
        });

        // Actualizar el carrito a completado
        cart.status = "completed";
        await cart.save();

        console.log(`✅ Venta para usuario '${cart.user.username}' creada`);
      }
    }

    console.log("🎉 Seed de ventas completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de ventas:", error);
  }
};

// Función principal que ejecuta todos los seeds
const runAllSeeds = async () => {
  try {
    console.log("🚀 Iniciando proceso completo de seed...\n");

    await seedRoles();
    await seedUsers();
    await seedCategories();
    await seedSuppliers();
    await seedProducts();
    await seedDiscounts();
    await seedReviews();
    await seedCarts();
    await seedSales();

    console.log("\n🎊 ¡Proceso de seed completado exitosamente!");
    console.log("\n📊 Resumen de datos creados:");
    console.log("   - Roles: 3 (admin, manager, user)");
    console.log("   - Usuarios: 4 (incluyendo admin)");
    console.log("   - Categorías: 6");
    console.log("   - Proveedores: 4");
    console.log("   - Productos: 10 con inventario");
    console.log("   - Descuentos: 5");
    console.log("   - Reseñas: 4");
    console.log("   - Carritos: 2");
    console.log("   - Ventas: 2");
    console.log("\n👤 Usuario administrador:");
    console.log("   Email: admin@papeleria.com");
    console.log("   Password: admin123");
  } catch (error) {
    console.error("❌ Error en el proceso de seed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión a la base de datos cerrada");
  }
};

// Ejecutar el seed si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllSeeds();
}

export {
  seedRoles,
  seedUsers,
  seedCategories,
  seedSuppliers,
  seedProducts,
  seedDiscounts,
  seedReviews,
  seedCarts,
  seedSales,
  runAllSeeds,
};
