import { Users } from "@prisma/client";
import { UsersModel } from "../models/user.model";
import { createHashAndSaltForPassword } from "../utils";
import { NotFoundError } from "../error";
import RolesModel from "../models/roles.model";

export interface GetAllUsersResponse {
  id: number;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}

const getAllUsers = async (): Promise<GetAllUsersResponse[]> => {
  const response: GetAllUsersResponse[] = [];
  const allUsers = await UsersModel.getAllUsers();
  for (const user of allUsers) {
    const role = await RolesModel.getRoleByUser(user);
    response.push({
      id: user.id,
      name: user.name,
      email: user.email,
      role: {
        id: role?.id || -1,
        name: role?.name || "N/A",
      },
    });
  }
  return response;
};

const createUser = async (
  name: string,
  email: string,
  password: string,
  roleId: number
) => {
  const role = await RolesModel.getRoleById(roleId);
  if (!role) {
    throw new NotFoundError("Role not found");
  }
  const { hash, salt } = createHashAndSaltForPassword(password);
  const user = await UsersModel.createUser(name, email, hash, salt);
  await RolesModel.assignRoleToUser(user, role);
  return user;
};

interface UpdateUserFunctionParam {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  roleId?: number;
}

const updateUser = async (param: UpdateUserFunctionParam) => {
  const newUser = {} as Partial<Users>;
  if (param.name) {
    newUser.name = param.name;
  }
  if (param.email) {
    newUser.email = param.email;
  }
  if (param.password) {
    const { hash, salt } = createHashAndSaltForPassword(param.password);
    newUser.hash = hash;
    newUser.salt = salt;
  }
  return UsersModel.updateUser(newUser);
};

const deleteUser = async (id: number) => {
  const user = await UsersModel.getUserById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  await RolesModel.deleteAllUserAssignedRole(user);
  return UsersModel.deleteUser(user);
};

const UserManagementService = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};

export default UserManagementService;
