import { Router } from "express";
import { validateJwtMiddleware } from "../../middleware";
import { getUserInfoFromRequest } from "../../utils";
import { MenuService } from "../../services/menus.service";
import { NotFoundError } from "../../error";

const menusRouter = Router();

menusRouter.use(validateJwtMiddleware);

menusRouter.get("/", async (req, res) => {
  const user = getUserInfoFromRequest(req);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const menus = await MenuService.getAllMenusForUser(user);

  return res.send(menus);
});

export default menusRouter;
