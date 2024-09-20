import { NotFoundError } from "../error";
import { UsersModel } from "../models/user.model";
import { generateCookieForUser } from "../utils";

export const generateCookie = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await UsersModel.getIsUserPasswordValid(email, password);
  if (!user) {
    throw new NotFoundError("Invalid email or password");
  }
  return generateCookieForUser(user);
};

export const LoginService = {
  generateCookie,
};
