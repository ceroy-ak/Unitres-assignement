import { Button } from "@/components/ui/button";
import { UserState } from "@/redux/store";
import AuthService from "@/service/auth.service";
import { Menu } from "@/service/menus.service";
import { LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface INavigationProps {
  menus: Menu[];
  isMenuLoading: boolean;
}
export default function Navigation({ menus, isMenuLoading }: INavigationProps) {
  const navigate = useNavigate();
  const userState = useSelector((state: any) => state as UserState);
  const handelLogout = async () => {
    await AuthService.logout();
    navigate("/login");
    toast.success("User logged out successfully");
  };
  const handleRouteNaviation = (menu: Menu) => {
    navigate(`/dashboard${menu.route}`);
  };
  return (
    <div
      className="w-full bg-slate-900 h-[100vh] sticky flex flex-col items-center"
      style={{
        position: "sticky",
      }}
    >
      <Avatar className="mt-6">
        <AvatarFallback>
          {userState?.name?.slice(0, 2)?.toUpperCase() || "US"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-between h-full w-full">
        {!isMenuLoading && menus.length > 0 && (
          <div className="flex flex-col items-center justify-start w-full gap-4 mt-5">
            {menus.map((menu) => (
              <Button
                key={menu.id}
                variant="ghost"
                className="w-full rounded-none text-left gap-5 text-slate-400"
                onClick={() => handleRouteNaviation(menu)}
              >
                {menu.title}
              </Button>
            ))}
          </div>
        )}
        {isMenuLoading && <div className="h-full"></div>}
        <Button
          variant="destructive"
          className="w-full rounded-none flex items-center justify-center gap-5 h-16"
          onClick={handelLogout}
        >
          Logout
          <LogOut size={20} />
        </Button>
      </div>
    </div>
  );
}
