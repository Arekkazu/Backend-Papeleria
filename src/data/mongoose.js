import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "Papeleria" });
    console.log("La base de datos está conectada");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
