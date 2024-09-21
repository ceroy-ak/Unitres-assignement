import { Router } from "express";
import { validateJwtMiddleware } from "../../middleware";
import { getUserInfoFromRequest } from "../../utils";
import { MenuService } from "../../services/menus.service";
import { BadRequestError, NotFoundError } from "../../error";

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

menusRouter.get("/is-route-allowed", async (req, res) => {
  const route = req.query?.["route"];
  if (!route || typeof route !== "string") {
    throw new BadRequestError("Invalid Request Parameters");
  }

  const user = getUserInfoFromRequest(req);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const allowed = await MenuService.getIsRouteAllowedForUser(route, user);

  return res.send({ allowed });
});

export default menusRouter;
