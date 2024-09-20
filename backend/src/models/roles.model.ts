import prisma, { Roles, Users } from "./orm";

const getRoleByUser = async (user: Users): Promise<Roles | null> => {
  const roleId = await prisma.userRoles.findFirst({
    where: {
      userId: user.id,
    },
  });

  const role = await prisma.roles.findUnique({
    where: {
      id: roleId?.roleId,
    },
  });
  return role;
};

const RolesModel = {
  getRoleByUser,
};

export default RolesModel;
