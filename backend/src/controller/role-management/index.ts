import { Router } from "express";
import { onlyAdminAllowed, validateJwtMiddleware } from "../../middleware";
import RolesService from "../../services/roles.service";
import { BadRequestError } from "../../error";

const roleManagementRouter = Router();
roleManagementRouter.use(validateJwtMiddleware);
roleManagementRouter.use(onlyAdminAllowed);

roleManagementRouter.get("/", async (_, res) => {
  const roles = await RolesService.getAllRoles();
  return res.send(roles);
});

roleManagementRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    throw new BadRequestError("Invalid role id");
  }
  await RolesService.deleteRole(Number(id));
  return res.send({ message: "Role deleted successfully" });
});
roleManagementRouter.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Role name is required");
  }
  await RolesService.createRole(name);
  const allRoles = await RolesService.getAllRoles();
  return res.send(allRoles);
});

export default roleManagementRouter;
