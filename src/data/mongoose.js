import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    console.log("Conecntando a la base de datos");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
