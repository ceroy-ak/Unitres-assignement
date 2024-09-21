import { Router } from "express";
import { onlyAdminAllowed, validateJwtMiddleware } from "../../middleware";
import SystemSettingsService from "../../services/system-settings.service";
import { BadRequestError } from "../../error";

const systemSettingsRouter = Router();
systemSettingsRouter.use(validateJwtMiddleware);
systemSettingsRouter.use(onlyAdminAllowed);

systemSettingsRouter.get("/", async (_, res) => {
  const systemSettings = await SystemSettingsService.getAllSystemSettings();
  res.send(systemSettings);
});
systemSettingsRouter.put("/update-ui", async (req, res) => {
  const { showHeader, showFooter, showMenu, roleId } = req.body;
  if (
    typeof showHeader === "undefined" &&
    typeof showFooter === "undefined" &&
    typeof showMenu === "undefined"
  ) {
    throw new BadRequestError("At least one UI option should be provided");
  }
  if (!roleId) {
    throw new BadRequestError("Role ID is required");
  }

  await SystemSettingsService.updateRoleUISettings(
    showHeader,
    showFooter,
    showMenu,
    roleId
  );
  return res.send("UI settings updated successfully");
});
systemSettingsRouter.delete("/role/:roleId/menu/:menuId", async (req, res) => {
  const { roleId, menuId } = req.params;
  if (!roleId || !menuId) {
    throw new BadRequestError("Role ID and Menu ID are required");
  }
  await SystemSettingsService.removeMenuFromRole(
    parseInt(menuId, 10),
    parseInt(roleId, 10)
  );
  return res.send("Menu removed from role successfully");
});

systemSettingsRouter.post("/create-menu", async (req, res) => {
  const { title, route, roleId } = req.body;
  if (!title || !route) {
    throw new BadRequestError("Title and route are required");
  }
  if (!roleId) {
    throw new BadRequestError("Role ID is required");
  }
  await SystemSettingsService.addMenuToRole(title, route, roleId);
  return res.send("Menu created successfully");
});

export default systemSettingsRouter;
