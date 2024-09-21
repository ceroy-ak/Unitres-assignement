import { NextFunction, Request, Response } from "express";
import { NotFoundError, UnauthorizedError } from "../error";
import { TOKEN_STRING } from "../constants";
import { getUserFromJwtToken } from "../utils";
import RolesModel from "../models/roles.model";
import { Users } from "@prisma/client";

export const validateJwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  if (!cookies?.[TOKEN_STRING]) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const user = await getUserFromJwtToken(cookies[TOKEN_STRING]);
    // @ts-ignore - Add user to the request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
};

export const onlyAdminAllowed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  let user: Users;
  try {
    user = await getUserFromJwtToken(cookies[TOKEN_STRING]);
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
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
