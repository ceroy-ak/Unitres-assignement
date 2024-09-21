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
      <div className="w-[15%]">
        <Navigation menus={menus} isMenuLoading={loading} />
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full h-16 bg-slate-500 flex items-center justify-center">
          <h1 className="text-2xl text-slate-50">This is Header</h1>
        </div>
        <div className="h-full">
          <Outlet />
        </div>
        <div className="w-full h-16 bg-slate-500 flex items-center justify-center">
          <h1 className="text-2xl text-slate-50">This is Footer</h1>
        </div>
      </div>
    </div>
  );
}
