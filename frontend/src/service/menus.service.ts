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

const MenusService = {
  getAllMenus,
};

export default MenusService;
