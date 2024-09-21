import { NotFoundError } from "../error";
import MenusModel from "../models/menus.model";
import RolesModel from "../models/roles.model";
import UIModel from "../models/ui.model";

export interface SystemSettingResponse {
  role: {
    id: number;
    name: string;
  };
  menus: {
    id: number;
    title: string;
    route: string;
  }[];
  ui: {
    showHeader: boolean;
    showFooter: boolean;
    showMenu: boolean;
  };
}

const getAllSystemSettings = async (): Promise<SystemSettingResponse[]> => {
  try {
    const response: SystemSettingResponse[] = [];
    const allRoles = await RolesModel.getAllRoles();
    for (const role of allRoles) {
      const ui = await UIModel.getUIOptionsByRole(role);
      const menus = await MenusModel.getMenusByRole(role);
      response.push({
        role: {
          id: role.id,
          name: role.name,
        },
        ui: {
          showHeader: ui?.showHeader || false,
          showFooter: ui?.showFooter || false,
          showMenu: ui?.showMenu || false,
        },
        menus: menus.map((menu) => {
          return {
            id: menu.id,
            title: menu.title,
            route: menu.route,
          };
        }),
      });
    }
    return response;
  } catch (error) {
    console.error("Error in getAllSystemSettings", error);
    return [];
  }
};

const updateRoleUISettings = async (
  showHeader: boolean,
  showFooter: boolean,
  showMenu: boolean,
  roleId: number
) => {
  await UIModel.updateUISettings(showHeader, showFooter, showMenu, roleId);
};

const removeMenuFromRole = async (menuId: number, roleId: number) => {
  const role = await RolesModel.getRoleById(roleId);
  const menu = await MenusModel.getMenuById(menuId);
  if (role && menu) {
    await MenusModel.removeMenuFromRole(menu, role);
  }
};

const addMenuToRole = async (
  menuTitle: string,
  menuRoute: string,
  roleId: number
) => {
  const role = await RolesModel.getRoleById(roleId);
  if (!role) {
    throw new NotFoundError("Role not found");
  }
  const menu = await MenusModel.createIfNotExists(menuTitle, menuRoute);
  await MenusModel.assignMenuToRole(menu, role);
};

const SystemSettingsService = {
  getAllSystemSettings,
  updateRoleUISettings,
  removeMenuFromRole,
  addMenuToRole,
};

export default SystemSettingsService;
