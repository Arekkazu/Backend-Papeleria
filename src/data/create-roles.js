import mongoose from "mongoose";
import { Role } from "./schema/roles.schemas.js";
import "dotenv/config";

const createRoles = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "Papeleria" });
    console.log("📡 Conectado a la base de datos");

    // Crear roles si no existen
    const roles = ["admin", "manager", "user"];

    for (const roleName of roles) {
      const existingRole = await Role.findOne({ roleName });
      
      if (existingRole) {
        console.log(`ℹ️  Rol '${roleName}' ya existe`);
      } else {
        await Role.create({ roleName });
        console.log(`✅ Rol '${roleName}' creado`);
      }
    }

    console.log("\n🎉 Proceso completado exitosamente");
    
    // Mostrar todos los roles
    const allRoles = await Role.find();
    console.log("\n📊 Roles en la base de datos:");
    allRoles.forEach(role => {
      console.log(`   - ${role.roleName} (ID: ${role._id})`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
    process.exit(0);
  }
};

createRoles();
