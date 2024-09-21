import { NextFunction, Request, Response, Router } from "express";
import { loginBodySchema, LoginRequestBody } from "./schema";
import { bodySchemaValidator, getUserFromJwtToken } from "../../utils";
import { LoginService } from "../../services/login.service";
import { TOKEN_STRING } from "../../constants";
import { UnauthorizedError } from "../../error";

const authRouter = Router();

authRouter.post(
  "/login",
  bodySchemaValidator(loginBodySchema),
  async (
    req: Request<unknown, unknown, LoginRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const cookie = await LoginService.generateCookie(
        req.body.email,
        req.body.password
      );
      if (!cookie) {
        throw new UnauthorizedError("Invalid email or password");
      }
      res.cookie(TOKEN_STRING, cookie, {
        httpOnly: true,
      });
      return res.send({ message: "Login successful" });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.get("/me", async (req, res) => {
  const user = await getUserFromJwtToken(req.cookies[TOKEN_STRING]);
  const details = await LoginService.getMeDetails(user);
  return res.send(details);
});

authRouter.post("/logout", async (_, res) => {
  res.clearCookie(TOKEN_STRING);
  return res.send({ message: "Logout successful" });
});

export default authRouter;
