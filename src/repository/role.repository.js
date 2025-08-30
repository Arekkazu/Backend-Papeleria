import { Role } from "../data/schema/roles.schemas.js";

export const RoleRepository = {
  getRoleUser: async () => {
    try {
      const role = await Role.findOne({ roleName: "user" }).select("_id");
      return role;
    } catch (error) {
      console.error(error);
    }
  },
};
