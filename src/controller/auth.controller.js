import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../data/schema/users.schemas.js";
import { Role } from "../data/schema/roles.schemas.js";

// Función para generar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );
};

// Función para configurar cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  });
};

export const AuthController = {
  // Registro de usuario
  register: async (req, res) => {
    try {
      const { username, email, password, roleName = "user" } = req.body;

      // Validar datos requeridos
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Todos los campos son requeridos",
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "El usuario o email ya existe",
        });
      }

      // Buscar el rol por roleName
      const role = await Role.findOne({ roleName });
      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Rol no encontrado",
        });
      }

      // Encriptar contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear nuevo usuario
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        rol: role._id, // referencia al rol
      });

      await newUser.save();

      // Generar token
      const token = generateToken(newUser._id);

      // Configurar cookie
      setTokenCookie(res, token);

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: role.roleName, // 👈 importante
        },
      });
    } catch (error) {
      console.error("Error en registro:", error.message, error.stack);
      res.status(500).json({
        success: false,
        message: error.message, // 👈 para saber qué está fallando
      });
    }
    
  },

  // Inicio de sesión
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos",
        });
      }

      // Buscar usuario y poblar rol
      const user = await User.findOne({ email }).populate("rol");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.rol.roleName, // 👈 aquí también
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },

  logout: (req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({
        success: true,
        message: "Sesión cerrada exitosamente",
      });
    } catch (error) {
      console.error("Error en logout:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate("rol");
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.rol.roleName, // 👈 corregido
        },
      });
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },

  verifyAuth: (req, res) => {
    res.status(200).json({
      success: true,
      message: "Usuario autenticado",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.rol.roleName, // 👈 corregido
      },
    });
  },
};
