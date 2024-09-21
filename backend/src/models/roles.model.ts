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

const getAllRoles = async () => {
  const roles = await prisma.roles.findMany();
  return roles;
};

const deleteAllUsersWithRole = async (role: Roles) => {
  await prisma.userRoles.deleteMany({
    where: {
      roleId: role.id,
    },
  });
};

const getRoleById = async (id: number) => {
  const role = await prisma.roles.findUnique({
    where: {
      id,
    },
  });
  return role;
};

const createRole = async (name: string) => {
  const role = await prisma.roles.create({
    data: {
      name,
      isAdmin: false,
    },
  });
  return role;
};

const deleteRole = async (role: Roles) => {
  await prisma.roles.delete({
    where: {
      id: role.id,
    },
  });
};

const assignRoleToUser = async (user: Users, role: Roles) => {
  await prisma.userRoles.create({
    data: {
      userId: user.id,
      roleId: role.id,
    },
  });
};

const deleteAllUserAssignedRole = async (user: Users) => {
  await prisma.userRoles.deleteMany({
    where: {
      userId: {
        equals: user.id,
      },
    },
  });
};

const RolesModel = {
  getRoleByUser,
  getAllRoles,
  deleteAllUsersWithRole,
  getRoleById,
  createRole,
  deleteRole,
  assignRoleToUser,
  deleteAllUserAssignedRole,
};

export default RolesModel;
