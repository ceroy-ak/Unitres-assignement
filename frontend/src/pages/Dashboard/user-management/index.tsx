import { Button } from "@/components/ui/button";
import UserService, { UserInfo } from "@/service/users.service";
import { Edit2, PlusIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import UserManagementDialog from "./user-management.dialog";

export default function UserManagment() {
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await UserService.getAllUsers();
      setAllUsers(allUsers);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    setSelectedUser(null);
    await fetchAllUsers();
    setIsDialogOpen(false);
  };

  const deleteUser = async (id: number) => {
    setIsLoading(true);
    try {
      await UserService.deleteUser(id);
      await fetchAllUsers();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BeatLoader />
      </div>
    );
  }
  return (
    <div className="mx-10">
      <div className="flex items-center justify-between my-5">
        <h1 className="text-2xl font-bold my-5">User Management</h1>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setIsDialogOpen(true);
          }}
        >
          <PlusIcon /> Add New User
        </Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        {allUsers.map((user) => (
          <div className="min-w-[300px] border border-gray-300 bg-white p-4 rounded-lg shadow-sm transition-transform transform hover:shadow-md hover:border-gray-400 hover:bg-gray-50">
            <h5>{user.name}</h5>
            <p>{user.email}</p>
            <p>
              <b>Role: </b>
              {user.role.name}
            </p>
            <div className="absolute top-2 right-2 flex items-center gap-5">
              <Edit2
                className="hover:scale-105 cursor-pointer"
                size={15}
                onClick={() => {
                  setSelectedUser(user);
                  setIsDialogOpen(true);
                }}
              />
              <Trash2
                className="hover:scale-105 cursor-pointer"
                size={15}
                onClick={() => deleteUser(user.id)}
              />
            </div>
          </div>
        ))}
      </div>
      <UserManagementDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={selectedUser}
        onUserCreated={refresh}
        onUserUpdated={refresh}
      />
    </div>
  );
}
