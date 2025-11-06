import { Review } from "../data/schema/review.schema.js";
import { Product } from "../data/schema/products.schema.js";

export const ReviewController = {
  // Crear nueva reseña
  create: async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId, rating, comment = "" } = req.body;

      if (!productId || !rating) {
        return res.status(400).json({
          success: false,
          message: "ID del producto y calificación son requeridos"
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "La calificación debe estar entre 1 y 5"
        });
      }

      // Verificar que el producto existe
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado"
        });
      }

      // Verificar si el usuario ya ha reseñado este producto
      const existingReview = await Review.findOne({
        user: userId,
        product: productId
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: "Ya has reseñado este producto"
        });
      }

      const review = new Review({
        user: userId,
        product: productId,
        rating,
        comment
      });

      await review.save();

      // Poblar datos para la respuesta
      await review.populate("user", "username");
      await review.populate("product", "name");

      res.status(201).json({
        success: true,
        message: "Reseña creada exitosamente",
        review
      });
    } catch (error) {
      console.error("Error al crear reseña:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener todas las reseñas
  getAll: async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate("user", "username")
        .populate("product", "name")
        .sort({ reviewDate: -1 });

      res.status(200).json({
        success: true,
        reviews
      });
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener reseñas de un producto específico
  getByProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      const reviews = await Review.find({ product: productId })
        .populate("user", "username")
        .populate("product", "name")
        .sort({ reviewDate: -1 });

      // Calcular promedio de calificaciones
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

      res.status(200).json({
        success: true,
        reviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews.length
      });
    } catch (error) {
      console.error("Error al obtener reseñas del producto:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener reseñas del usuario autenticado
  getMyReviews: async (req, res) => {
    try {
      const userId = req.user._id;

      const reviews = await Review.find({ user: userId })
        .populate("user", "username")
        .populate("product", "name")
        .sort({ reviewDate: -1 });

      res.status(200).json({
        success: true,
        reviews
      });
    } catch (error) {
      console.error("Error al obtener reseñas del usuario:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener reseña por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const review = await Review.findById(id)
        .populate("user", "username")
        .populate("product", "name");

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Reseña no encontrada"
        });
      }

      res.status(200).json({
        success: true,
        review
      });
    } catch (error) {
      console.error("Error al obtener reseña:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Actualizar reseña
  update: async (req, res) => {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const { rating, comment } = req.body;

      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Reseña no encontrada"
        });
      }

      // Verificar que el usuario es el dueño de la reseña
      if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para editar esta reseña"
        });
      }

      if (rating !== undefined) {
        if (rating < 1 || rating > 5) {
          return res.status(400).json({
            success: false,
            message: "La calificación debe estar entre 1 y 5"
          });
        }
        review.rating = rating;
      }

      if (comment !== undefined) {
        review.comment = comment;
      }

      review.reviewDate = new Date();

      await review.save();

      // Poblar datos para la respuesta
      await review.populate("user", "username");
      await review.populate("product", "name");

      res.status(200).json({
        success: true,
        message: "Reseña actualizada exitosamente",
        review
      });
    } catch (error) {
      console.error("Error al actualizar reseña:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Eliminar reseña
  delete: async (req, res) => {
    try {
      const userId = req.user._id;
      const { id } = req.params;

      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Reseña no encontrada"
        });
      }

      // Verificar que el usuario es el dueño de la reseña o es admin
      const isOwner = review.user.toString() === userId.toString();
      const isAdmin = req.user.rol?.roleName === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para eliminar esta reseña"
        });
      }

      await Review.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Reseña eliminada exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar reseña:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener estadísticas de reseñas de un producto
  getProductStats: async (req, res) => {
    try {
      const { productId } = req.params;

      const reviews = await Review.find({ product: productId });

      if (reviews.length === 0) {
        return res.status(200).json({
          success: true,
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
          }
        });
      }

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

      const ratingDistribution = {
        1: reviews.filter(r => r.rating === 1).length,
        2: reviews.filter(r => r.rating === 2).length,
        3: reviews.filter(r => r.rating === 3).length,
        4: reviews.filter(r => r.rating === 4).length,
        5: reviews.filter(r => r.rating === 5).length
      };

      res.status(200).json({
        success: true,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews.length,
        ratingDistribution
      });
    } catch (error) {
      console.error("Error al obtener estadísticas del producto:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
};
