import { Menus, Users } from "@prisma/client";
import MenusModel from "../models/menus.model";
import RolesModel from "../models/roles.model";
import { NotFoundError } from "../error";

const getAllMenusForUser = async (user: Users): Promise<Menus[]> => {
  const role = await RolesModel.getRoleByUser(user);
  if (!role) {
    throw new NotFoundError("No active role found for user");
  }

  const menus = await MenusModel.getMenusByRole(role);
  return menus;
};

export const MenuService = {
  getAllMenusForUser,
};
