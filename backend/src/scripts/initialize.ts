// export async function createAdminUser() {
//     const { hash, salt } = createHashAndSaltForPassword("root");
//     const adminUser = await prisma.users.create({
//       data: {
//         email: "abhishek1091998@gmail.com",
//         hash,
//         salt,
//         name: "Abhishek (Admin)",
//       },
//     });

import prisma from "../models/orm";

//     const adminRole = await prisma.roles.create({
//       data: {
//         isAdmin: true,
//         name: "Admin",
//       },
//     });

//     await prisma.userRoles.create({
//       data: {
//         roleId: adminRole.id,
//         userId: adminUser.id,
//       },
//     });
//     console.log("Admin user created successfully");
//   }

export async function initialize() {
  const userRole = await prisma.roles.create({
    data: {
      isAdmin: false,
      name: "User",
    },
  });

  const managerRole = await prisma.roles.create({
    data: {
      isAdmin: false,
      name: "Manager",
    },
  });

  const userMenuOptions = [
    {
      name: "Dashboard",
      route: "/dashboard",
    },
    {
      name: "Profile",
      route: "/profile",
    },
    {
      name: "My Tasks",
      route: "/tasks",
    },
    {
      name: "Notifications",
      route: "/notifications",
    },
    {
      name: "Help",
      route: "/help",
    },
  ];

  for (const userMenuOption of userMenuOptions) {
    let menuOption = await prisma.menus.findFirst({
      where: {
        route: userMenuOption.route,
      },
    });
    if (!menuOption) {
      menuOption = await prisma.menus.create({
        data: {
          title: userMenuOption.name,
          route: userMenuOption.route,
        },
      });
    }

    await prisma.roleMenus.create({
      data: {
        menuId: menuOption.id,
        roleId: userRole.id,
      },
    });
  }

  const managerMenuOptions = [
    {
      name: "Dashboard",
      route: "/dashboard",
    },
    {
      name: "Profile",
      route: "/profile",
    },
    {
      name: "Team Management",
      route: "/team",
    },
    {
      name: "Project Overview",
      route: "/projects",
    },
    {
      name: "Reports",
      route: "/reports",
    },
    {
      name: "Notifications",
      route: "/notifications",
    },
    {
      name: "Help",
      route: "/help",
    },
  ];

  for (const managerMenuOption of managerMenuOptions) {
    let menuOption = await prisma.menus.findFirst({
      where: {
        route: managerMenuOption.route,
      },
    });
    if (!menuOption) {
      menuOption = await prisma.menus.create({
        data: {
          title: managerMenuOption.name,
          route: managerMenuOption.route,
        },
      });
    }

    await prisma.roleMenus.create({
      data: {
        menuId: menuOption.id,
        roleId: managerRole.id,
      },
    });
  }

  const adminUser = await prisma.users.findUnique({
    where: {
      email: "abhishek1091998@gmail.com",
    },
  });

  const adminRole = await prisma.roles.findFirst({
    where: {
      isAdmin: true,
    },
  });

  const adminMenuOptions = [
    {
      name: "Dashboard",
      route: "/dashboard",
    },
    {
      name: "User Management",
      route: "/users",
    },
    {
      name: "Role Management",
      route: "/roles",
    },
    {
      name: "System Settings",
      route: "/settings",
    },
    {
      name: "Reports",
      route: "/reports",
    },
    {
      name: "Notifications",
      route: "/notifications",
    },
    {
      name: "Help",
      route: "/help",
    },
  ];

  for (const adminMenuOption of adminMenuOptions) {
    let menuOption = await prisma.menus.findFirst({
      where: {
        route: adminMenuOption.route,
      },
    });
    if (!menuOption) {
      menuOption = await prisma.menus.create({
        data: {
          title: adminMenuOption.name,
          route: adminMenuOption.route,
        },
      });
    }

    await prisma.roleMenus.create({
      data: {
        menuId: menuOption.id,
        roleId: adminRole!.id!,
      },
    });
  }
}
