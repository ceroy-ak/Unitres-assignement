import { NextFunction, Request, Response } from "express";
import { NotFoundError, UnauthorizedError } from "../error";
import { TOKEN_STRING } from "../constants";
import { getUserFromJwtToken, getUserInfoFromRequest } from "../utils";
import RolesModel from "../models/roles.model";

export const validateJwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  if (!cookies?.[TOKEN_STRING]) {
    throw new UnauthorizedError("Unauthorized");
  }
  const user = getUserFromJwtToken(cookies[TOKEN_STRING]);
  // @ts-ignore - Add user to the request object
  req.user = user;
  next();
};

export const onlyAdminAllowed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const user = await getUserFromJwtToken(cookies[TOKEN_STRING]);
  if (!user) {
    next(new NotFoundError("User not found"));
    return;
  }
  const role = await RolesModel.getRoleByUser(user);
  if (!role?.isAdmin) {
    next(new UnauthorizedError("User not authorized to use the endpoint"));
    return;
  }
  next();
};
