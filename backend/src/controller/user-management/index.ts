import { Router } from "express";
import { onlyAdminAllowed, validateJwtMiddleware } from "../../middleware";
import { BadRequestError } from "../../error";
import UserManagementService from "../../services/user-management.service";

const userManagementRouter = Router();
userManagementRouter.use(validateJwtMiddleware);
userManagementRouter.use(onlyAdminAllowed);

userManagementRouter.get("/", async (req, res) => {
  const users = await UserManagementService.getAllUsers();
  return res.send(users);
});
userManagementRouter.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role || !role.id) {
    throw new BadRequestError("Name, email and password are required");
  }
  await UserManagementService.createUser(name, email, password, role.id);
  const allUsers = await UserManagementService.getAllUsers();
  return res.send(allUsers);
});
userManagementRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    throw new BadRequestError("Invalid user id");
  }
  await UserManagementService.deleteUser(Number(id));
  return res.send({ message: "User deleted successfully" });
});
userManagementRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  if (!id || isNaN(Number(id))) {
    throw new BadRequestError("Invalid user id");
  }
  await UserManagementService.updateUser({
    id: Number(id),
    name,
    email,
    password,
    roleId: role?.id || undefined,
  });
  return res.send({ message: "User updated successfully" });
});

export default userManagementRouter;
