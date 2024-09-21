import { Roles } from "@prisma/client";
import prisma from "./orm";

const getUIOptionsByRole = async (role: Roles) => {
  const result = await prisma.rolesUIDisplay.findFirst({
    where: {
      roleId: role.id,
    },
  });
  return result;
};

const createUIOptionsForRole = async (
  role: Roles,
  showHeader: boolean,
  showFooter: boolean,
  showMenu: boolean
) => {
  const result = await prisma.rolesUIDisplay.create({
    data: {
      roleId: role.id,
      showHeader,
      showFooter,
      showMenu,
    },
  });
  return result;
};

const deleteUIOptionsForRole = async (role: Roles) => {
  await prisma.rolesUIDisplay.delete({
    where: {
      roleId: role.id,
    },
  });
};

const updateUISettings = async (
  showHeader: boolean,
  showFooter: boolean,
  showMenu: boolean,
  roleId: number
) => {
  await prisma.rolesUIDisplay.update({
    where: {
      roleId,
    },
    data: {
      showHeader,
      showFooter,
      showMenu,
    },
  });
};

const UIModel = {
  getUIOptionsByRole,
  createUIOptionsForRole,
  deleteUIOptionsForRole,
  updateUISettings,
};

export default UIModel;
