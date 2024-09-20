import prisma, { Roles } from "./orm";

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

const MenusModel = {
  getMenusByRole,
};

export default MenusModel;
