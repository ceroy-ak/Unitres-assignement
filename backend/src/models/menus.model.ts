import prisma, { Menus, Roles } from "./orm";

const getMenusByRole = async (role: Roles) => {
  const menuIds = await prisma.roleMenus.findMany({
    where: {
      roleId: role.id,
    },
  });

  const menus = await prisma.menus.findMany({
    where: {
      id: {
        in: menuIds.map((menu) => menu.menuId),
      },
    },
  });

  return menus || [];
};

const getUniqueMenuForRoleByRoute = async (route: string, role: Roles) => {
  const menuIds = await prisma.roleMenus.findMany({
    where: {
      roleId: role.id,
    },
  });

  const menu = await prisma.menus.findFirst({
    where: {
      id: {
        in: menuIds.map((menu) => menu.menuId),
      },
      AND: {
        route: {
          contains: route,
        },
      },
    },
  });

  return menu;
};

const deleteAllAssignedMenusForRole = async (role: Roles) => {
  await prisma.roleMenus.deleteMany({
    where: {
      roleId: role.id,
    },
  });
};

const createMenu = async (title: string, route: string) => {
  const menu = await prisma.menus.create({
    data: {
      title,
      route,
    },
  });
  return menu;
};

const assignMenuToRole = async (menu: Menus, role: Roles) => {
  await prisma.roleMenus.create({
    data: {
      menuId: menu.id,
      roleId: role.id,
    },
  });
};

const removeMenuFromRole = async (menu: Menus, role: Roles) => {
  await prisma.roleMenus.deleteMany({
    where: {
      menuId: menu.id,
      roleId: role.id,
    },
  });
};

const getMenuById = async (id: number) => {
  const menu = await prisma.menus.findUnique({
    where: {
      id,
    },
  });
  return menu;
};

const createIfNotExists = async (title: string, route: string) => {
  const menu = await prisma.menus.findFirst({
    where: {
      route,
    },
  });

  if (!menu) {
    return await createMenu(title, route);
  }

  return menu;
};

const MenusModel = {
  getMenusByRole,
  getUniqueMenuForRoleByRoute,
  deleteAllAssignedMenusForRole,
  createMenu,
  assignMenuToRole,
  removeMenuFromRole,
  getMenuById,
  createIfNotExists,
};

export default MenusModel;
