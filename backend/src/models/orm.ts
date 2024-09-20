import {
  PrismaClient,
  Users,
  UserRoles,
  Menus,
  RoleMenus,
  Roles,
} from "@prisma/client";

const prisma = new PrismaClient();

export { Users, UserRoles, Menus, RoleMenus, Roles };
export default prisma;
