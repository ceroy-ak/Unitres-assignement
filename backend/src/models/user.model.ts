import {
  createHashAndSaltForPassword,
  createHashForPasswordAndSalt,
} from "../utils";
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
    console.log(user);
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

export const UsersModel = {
  getIsUserPasswordValid,
  getUserByEmail,
};
