import { User } from "../data/schema/users.schemas.js";

export const UsersRepository = {
  createUser: async (username, email, password, rol) => {
    return await User.create({ username, email, password, rol });
  },
};
