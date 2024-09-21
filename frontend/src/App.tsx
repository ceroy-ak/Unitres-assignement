import { ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UnknownRoute from "./pages/Dashboard/UnknownRoute";
import UserManagment from "./pages/Dashboard/user-management";
import RoleManagement from "./pages/Dashboard/role-management";
import SystemSettings from "./pages/Dashboard/system-settings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Introduction />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard/user-management"
            element={<UserManagment />}
          />
          <Route
            path="/dashboard/role-management"
            element={<RoleManagement />}
          />
          <Route
            path="/dashboard/system-settings"
            element={<SystemSettings />}
          />
          <Route
            path="/dashboard/"
            element={<UnknownRoute forceText="Dashboard" />}
          />
          <Route path="/dashboard/:unknownRoute" element={<UnknownRoute />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Introduction() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center gap-10">
      <h1 className="text-3xl font-bold">Unitres Assignment</h1>
      <p>by Abhishek Kumar</p>
      <Button
        className="flex justify-between items-center w-[200px]"
        onClick={() => navigate("/dashboard")}
      >
        <span> Continue</span> <ChevronRight />
      </Button>
    </div>
  );
}
