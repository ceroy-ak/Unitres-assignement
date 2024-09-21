import { http } from "@/http";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}

export interface UpdateUserInfoRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: {
    id: number;
  };
}
export interface CreateUserInfoRequest {
  name: string;
  email: string;
  password: string;
  role: {
    id: number;
  };
}

const getAllUsers = async (): Promise<UserInfo[]> => {
  const response = await http.get("/user-management");
  if (response.status === 200) {
    return response.data;
  }
  return [];
};
const deleteUser = async (id: number): Promise<void> => {
  await http.delete(`/user-management/${id}`);
};
const updateUser = async (
  id: number,
  user: UpdateUserInfoRequest
): Promise<void> => {
  await http.put(`/user-management/${id}`, user);
};
const createUser = async (user: CreateUserInfoRequest): Promise<void> => {
  await http.post("/user-management", user);
};

const UserService = {
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
};

export default UserService;
