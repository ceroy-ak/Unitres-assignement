import { NotFoundError } from "../error";
import MenusModel from "../models/menus.model";
import RolesModel from "../models/roles.model";
import UIModel from "../models/ui.model";

const getAllRoles = async () => {
  const roles = await RolesModel.getAllRoles();
  return roles;
};

const deleteRole = async (id: number) => {
  const role = await RolesModel.getRoleById(id);
  if (!role) {
    throw new NotFoundError("Role not found");
  }
  await RolesModel.deleteAllUsersWithRole(role);
  await RolesModel.deleteRole(role);
  await UIModel.deleteUIOptionsForRole(role);
  await MenusModel.deleteAllAssignedMenusForRole(role);
};

const createRole = async (name: string) => {
  const role = await RolesModel.createRole(name);
  await UIModel.createUIOptionsForRole(role, true, true, true);
  return role;
};

const RolesService = {
  getAllRoles,
  deleteRole,
  createRole,
};

export default RolesService;
