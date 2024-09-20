import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./controller/auth";
import adminRouter from "./controller/admin";
import menusRouter from "./controller/menus";
import * as dotenv from "dotenv";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
} from "./error";

dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/menus", menusRouter);

// Global error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError ||
    err instanceof InternalServerError ||
    err instanceof ServiceUnavailableError
  ) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Unexpected server error" });
  }
});

app.get("/ping", (_, res) => {
  res.send("pong");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
