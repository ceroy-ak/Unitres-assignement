import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../error";
import { TOKEN_STRING } from "../constants";
import { getUserFromJwtToken } from "../utils";

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
