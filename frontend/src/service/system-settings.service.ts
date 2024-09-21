import { http } from "@/http";

export interface ISystemSettings {
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

const getAllSystemSettings = async (): Promise<ISystemSettings[]> => {
  const response = await http.get("/system-settings");
  if (response.status !== 200) {
    return [];
  }
  return response.data;
};

export interface IUpdateUISettingsRequestBody {
  showHeader: boolean;
  showFooter: boolean;
  showMenu: boolean;
  roleId: number;
}

const updateUISettings = async (data: IUpdateUISettingsRequestBody) => {
  const response = await http.put("/system-settings/update-ui", data);
  if (response.status !== 200) {
    throw new Error("Failed to update system settings");
  }
};

const deleteMenuForRole = async (roleId: number, menuId: number) => {
  await http.delete(`/system-settings/role/${roleId}/menu/${menuId}`);
};

const addMenuForRole = async (
  roleId: number,
  menuTitle: string,
  menuRoute: string
) => {
  await http.post(`/system-settings/create-menu`, {
    title: menuTitle,
    route: menuRoute,
    roleId,
  });
};

const SystemSettingsService = {
  getAllSystemSettings,
  updateUISettings,
  deleteMenuForRole,
  addMenuForRole,
};

export default SystemSettingsService;
