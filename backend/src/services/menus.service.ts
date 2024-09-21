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

const getIsRouteAllowedForUser = async (
  route: string,
  user: Users
): Promise<boolean> => {
  try {
    const role = await RolesModel.getRoleByUser(user);
    if (!role) {
      throw new NotFoundError("No active role found for user");
    }

    const menu = await MenusModel.getUniqueMenuForRoleByRoute(route, role);
    if (!menu) return false;
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

export const MenuService = {
  getAllMenusForUser,
  getIsRouteAllowedForUser,
};
