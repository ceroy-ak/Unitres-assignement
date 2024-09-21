import MenusService from "@/service/menus.service";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!location?.pathname) {
      setIsLoading(false);
      return;
    }

    const route = `/${location.pathname?.split("/")?.[2] || ""}`;
    setIsLoading(true);
    MenusService.getIsRouteAllowed(route)
      .then((response) => {
        if (!response) {
          throw new Error("Route is not allowed");
        }
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("You are not allowed to view this Page!");
        navigate("/");
      })
      .finally(() => [setIsLoading(false)]);
  }, [location.pathname]);
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return <Outlet />;
}
