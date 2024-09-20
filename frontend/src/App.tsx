import { ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UnknownRoute from "./pages/Dashboard/UnknownRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Introduction />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="/dashboard/:unknownRoute" element={<UnknownRoute />} />
      </Route>
    </Routes>
  );
}

function Introduction() {
  return (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center gap-10">
      <h1 className="text-3xl font-bold">Unitres Assignment</h1>
      <p>by Abhishek Kumar</p>
      <Button className="flex justify-between items-center w-[200px]">
        <span> Continue</span> <ChevronRight />
      </Button>
    </div>
  );
}
