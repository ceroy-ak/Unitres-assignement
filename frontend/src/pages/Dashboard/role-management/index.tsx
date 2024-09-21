import { Input } from "@/components/ui/input";
import RolesService, { Role } from "@/service/roles.service";
import { Plus, Trash2 } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function RoleManagement() {
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const fetchAllRoles = async () => {
    setIsLoading(true);
    try {
      const allRoles = await RolesService.getAllRoles();
      setAllRoles(allRoles);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch roles");
      setIsLoading(false);
    }
  };

  const addRole = async () => {
    setIsLoading(true);
    try {
      await RolesService.addRole(newRoleName);
      setNewRoleName("");
      setIsAddingRole(false);
      fetchAllRoles();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add role");
      setIsLoading(false);
    }
  };

  const deleteRole = async (roleId: number) => {
    setIsLoading(true);
    try {
      await RolesService.deleteRole(roleId);
      fetchAllRoles();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete role");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllRoles();
  }, []);
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BeatLoader />
      </div>
    );
  }
  return (
    <div className="mx-10">
      <h1 className="text-2xl font-bold my-5">Role Management</h1>
      <div className="flex flex-col gap-5">
        {allRoles.map((role) => (
          <div
            className="bg-slate-900 text-slate-100 p-5 rounded-lg text-3xl flex items-center justify-center"
            style={{
              opacity: role.isAdmin ? 0.5 : 1,
              pointerEvents: role.isAdmin ? "none" : "auto",
            }}
          >
            <span>{role.name}</span>
            <Trash2
              className="w-6 h-6 ml-auto cursor-pointer hover:scale-110"
              onClick={() => {
                if (role.isAdmin) {
                  toast.error("Cannot delete admin role");
                  return;
                }
                deleteRole(role.id);
              }}
            />
          </div>
        ))}
        {!isAddingRole && (
          <div
            className="bg-slate-500 text-slate-100 p-5 rounded-lg text-3xl flex items-center justify-center cursor-pointer"
            onClick={() => setIsAddingRole(true)}
          >
            <Plus className="w-6 h-6 mr-2 hover:scale-110" />
          </div>
        )}
        {isAddingRole && (
          <>
            <div className="rounded-lg text-3xl flex items-center justify-center">
              <Input
                type="text"
                className="p-5 rounded-lg text-xl"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Add new role name"
              />
              <Plus
                className="w-6 h-6 ml-2 cursor-pointer hover:scale-110"
                onClick={addRole}
              />
              <Trash2
                className="w-6 h-6 ml-2 cursor-pointer hover:scale-110"
                onClick={() => {
                  setIsAddingRole(false);
                  setNewRoleName("");
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
