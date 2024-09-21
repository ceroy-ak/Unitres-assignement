import { http } from "@/http";

export interface Menu {
  id: number;
  title: string;
  route: string;
}

const getAllMenus = async () => {
  const response = await http.get("/menus");
  if (response.status === 200) {
    return response.data as Menu[];
  }
  return [];
};

const getIsRouteAllowed = async (route: string): Promise<boolean> => {
  const response = await http.get(`/menus/is-route-allowed?route=${route}`);
  if (response.status !== 200) return false;
  return (response.data as any)?.allowed || false;
};

const MenusService = {
  getAllMenus,
  getIsRouteAllowed,
};

export default MenusService;
