import { Users } from "@prisma/client";
import { NotFoundError } from "../error";
import { UsersModel } from "../models/user.model";
import { generateCookieForUser } from "../utils";
import RolesModel from "../models/roles.model";
import UIModel from "../models/ui.model";

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

interface IGetMeDetails {
  name: string;
  email: string;
  showHeader: boolean;
  showMenu: boolean;
  showFooter: boolean;
}
const getMeDetails = async (user: Users): Promise<IGetMeDetails> => {
  const role = await RolesModel.getRoleByUser(user);
  if (!role) {
    throw new NotFoundError("No active role found for user");
  }
  const uiOptions = await UIModel.getUIOptionsByRole(role);
  return {
    name: user.name,
    email: user.email,
    showHeader: uiOptions?.showHeader!,
    showMenu: uiOptions?.showMenu!,
    showFooter: uiOptions?.showFooter!,
  };
};
export const LoginService = {
  generateCookie,
  getMeDetails,
};
