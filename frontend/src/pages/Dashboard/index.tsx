import MenusService, { Menu } from "@/service/menus.service";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";
import AuthService, { IGetMeDetails } from "@/service/auth.service";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/store";

export default function Dashboard() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [meDetails, setMeDetails] = useState<IGetMeDetails | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMenusAndMe = async () => {
      setLoading(true);
      try {
        const [menus, meDetails] = await Promise.all([
          MenusService.getAllMenus(),
          AuthService.me(),
        ]);
        setMenus(menus);
        setMeDetails(meDetails);
        setLoading(false);
        dispatch(setUser(meDetails.name, meDetails.email) as any);
      } catch (error) {
        toast.error("Failed to fetch menus");
      } finally {
        setLoading(false);
      }
    };
    fetchMenusAndMe();
  }, []);
  return (
    <div className="flex w-full h-full">
      {meDetails?.showMenu && (
        <div className="w-[15%]">
          <Navigation menus={menus} isMenuLoading={loading} />
        </div>
      )}
      <div className="w-full flex flex-col">
        {meDetails?.showHeader && (
          <div className="w-full h-16 bg-slate-500 flex items-center justify-center">
            <h1 className="text-2xl text-slate-50">This is Header</h1>
          </div>
        )}
        <div className="h-full">
          <Outlet />
        </div>
        {meDetails?.showFooter && (
          <div className="w-full h-16 bg-slate-500 flex items-center justify-center">
            <h1 className="text-2xl text-slate-50">This is Footer</h1>
          </div>
        )}
      </div>
    </div>
  );
}
