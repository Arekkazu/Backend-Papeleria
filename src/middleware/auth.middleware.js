import jwt from "jsonwebtoken";
import { User } from "../data/schema/users.schemas.js";

export const authenticateToken = async (req, res, next) => {
  try {
    // Obtener el token de las cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido"
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.userId).populate('rol');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Agregar el usuario al request para uso posterior
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Token inválido"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expirado"
      });
    }

    console.error("Error en autenticación:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
    }

    const userRole = req.user.rol?.name || req.user.rol;
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para acceder a este recurso"
      });
    }

    next();
  };
};
