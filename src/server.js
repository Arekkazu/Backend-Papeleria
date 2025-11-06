import Express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/routes.js";

const app = Express();

// Middleware de configuración
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Configuración de CORS para cookies
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  }),
);

// Rutas
app.use(router);
export const initServer = () => {
  const PORT = process.env.PORT || 3000; // fallback si no existe
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
