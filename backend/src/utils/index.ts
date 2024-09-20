import { Users } from "@prisma/client";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import * as jose from "jose";
import { UnauthorizedError } from "../error";
import { UsersModel } from "../models/user.model";

interface IHashAndSalt {
  hash: string;
  salt: string;
}

export const createHashAndSaltForPassword = (
  password: string
): IHashAndSalt => {
  // Generate salt
  const salt = crypto.randomBytes(16).toString("hex");

  // Generate hash
  const hash = createHashForPasswordAndSalt(password, salt);

  return { hash, salt };
};

export const createHashForPasswordAndSalt = (
  password: string,
  salt: string
): string => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};

export const bodySchemaValidator =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate req.body against the passed schema
      schema.parse(req.body);
      next(); // Proceed to the next middleware or route handler if validation passes
    } catch (err) {
      // Handle Zod validation errors
      if (err instanceof ZodError) {
        res.status(400).json({ error: "Invalid Request Body" });
      } else {
        next(err); // Pass non-validation errors to the next error handler
      }
    }
  };

export const generateCookieForUser = async (user: Users): Promise<string> => {
  // Create a JWT token
  const token = await new jose.SignJWT({ id: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(getJwtSecretKey());

  return token;
};

export const getUserFromJwtToken = async (token: string): Promise<Users> => {
  const { payload } = await jose.jwtVerify(token, getJwtSecretKey(), {
    algorithms: ["HS256"],
  });
  const id = payload.id as string;
  const email = payload.email as string;
  if (!id || !email) {
    throw new UnauthorizedError("Invalid JWT token");
  }

  const user = await UsersModel.getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return user;
};

const getJwtSecretKey = () => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT secret key not found");
  }
  return new TextEncoder().encode(secretKey);
};

export const getUserInfoFromRequest = (
  req: Request
): Users | undefined | null => {
  // @ts-ignore - Add user to the request object
  return req?.user;
};
