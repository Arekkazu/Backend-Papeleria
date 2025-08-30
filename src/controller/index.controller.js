import { RoleRepository } from "../repository/role.repository.js";
import { UsersRepository } from "../repository/users.respository.js";

export const IndexController = {
  index: async (req, res) => {
    try {
      const rol = await RoleRepository.getRoleUser(); // "user"
      // Arekkazu, Contraseña
      await UsersRepository.createUser(
        "MiguelDev",
        "ass@gmasil.com",
        "contraseña",
        rol,
      );
      res.status(200).json({ Message: "Usuario Creado" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ Message: "Usuario Ya creado" });
    }
  },
};
