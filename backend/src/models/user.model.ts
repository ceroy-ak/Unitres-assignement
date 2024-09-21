import { NotFoundError } from "../error";
import { createHashForPasswordAndSalt } from "../utils";
import prisma, { Users } from "./orm";

export interface UserInfo {
  email: string;
  name: string;
}

const getIsUserPasswordValid = async (
  email: string,
  password: string
): Promise<Users | null> => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return null;
    }
    const hash = createHashForPasswordAndSalt(password, user.salt);
    if (hash === user.hash) {
      return user;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

const getUserByEmail = async (email: string) => {
  try {
    return await prisma.users.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAllUsers = async () => {
  try {
    return await prisma.users.findMany();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const createUser = async (
  name: string,
  email: string,
  hash: string,
  salt: string
) => {
  return await prisma.users.create({
    data: {
      name,
      email,
      hash,
      salt,
    },
  });
};

const updateUser = async (newUser: Partial<Users>) => {
  const existingUser = await prisma.users.findUnique({
    where: {
      id: newUser.id,
    },
  });
  if (!existingUser) {
    throw new NotFoundError("User not found");
  }
  const updateUser: Users = {
    ...existingUser,
    ...newUser,
  };
  return prisma.users.update({
    where: {
      id: newUser.id,
    },
    data: updateUser,
  });
};

const deleteUser = async (user: Users) => {
  return prisma.users.delete({
    where: {
      id: user.id,
    },
  });
};

const getUserById = async (id: number) => {
  return prisma.users.findFirst({
    where: {
      id,
    },
  });
};

export const UsersModel = {
  getIsUserPasswordValid,
  getUserByEmail,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
};
