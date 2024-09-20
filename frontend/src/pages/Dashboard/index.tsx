import MenusService, { Menu } from "@/service/menus.service";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMenus = async () => {
      const menus = await MenusService.getAllMenus();
      setMenus(menus);
      setLoading(false);
    };
    fetchMenus();
  }, []);
  return (
    <div className="flex w-full h-full">
      <Navigation menus={menus} isMenuLoading={loading} />
      <div className="h-[100vh] w-full">
        <Outlet />
      </div>
    </div>
  );
}
