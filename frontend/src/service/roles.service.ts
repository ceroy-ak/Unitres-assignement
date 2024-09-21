import { http } from "@/http";

export interface Role {
  id: number;
  name: string;
  isAdmin: boolean;
}

const getAllRoles = async (): Promise<Role[]> => {
  const response = await http.get("/role-management");
  return response.data;
};

const deleteRole = async (roleId: number) => {
  await http.delete(`/role-management/${roleId}`);
};
const addRole = async (roleName: string) => {
  await http.post("/role-management", { name: roleName });
};

const RolesService = {
  getAllRoles,
  deleteRole,
  addRole,
};

export default RolesService;
