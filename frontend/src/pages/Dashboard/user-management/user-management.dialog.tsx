import UserService, {
  UpdateUserInfoRequest,
  UserInfo,
} from "@/service/users.service";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import RolesService, { Role } from "@/service/roles.service";

interface UserManagementDialogProps {
  open: boolean;
  onClose: () => void;
  user?: UserInfo | null;
  onUserUpdated?: () => void;
  onUserCreated?: () => void;
}

export default function UserManagementDialog({
  onClose,
  open,
  onUserCreated,
  onUserUpdated,
  user,
}: UserManagementDialogProps) {
  const isNewUser = useMemo(() => !user, [user]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserInfo["role"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allRoles, setAllRoles] = useState<Role[]>([]);

  useEffect(() => {
    setIsLoading(true);
    RolesService.getAllRoles()
      .then((roles) => {
        setAllRoles(roles);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user && open) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user, open]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (isNewUser) {
        if (!role) {
          toast.error("Please select a role");
          return;
        }
        if (!name || !email || !password) {
          toast.error("Please fill all the fields");
          return;
        }
        await UserService.createUser({
          email,
          name,
          password,
          role: {
            id: role.id,
          },
        });
        toast.success("User created successfully");
        onUserCreated && onUserCreated();
        return;
      }
      if (!user) {
        toast.error("User not found");
        return;
      }
      const updatePayload: UpdateUserInfoRequest = {};
      if (name !== user.name && name) {
        updatePayload.name = name;
      }
      if (email !== user.email && email) {
        updatePayload.email = email;
      }
      if (password) {
        updatePayload.password = password;
      }
      if (role?.id !== user.role.id && role) {
        updatePayload.role = {
          id: role?.id,
        };
      }
      await UserService.updateUser(user.id, updatePayload);
      toast.success("User updated successfully");
      onUserUpdated && onUserUpdated();
    } catch (error) {
      toast.error("Failed to create or update the user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (roleId: string) => {
    const role = allRoles.find((role) => role.id === Number(roleId));
    if (role) {
      setRole(role);
      return;
    }
    toast.error("Role not found");
  };

  const handleClose = (open: boolean) => {
    if (isLoading) {
      toast.error("Please wait until the operation is completed.");
      return;
    }
    if (!open) {
      setEmail("");
      setName("");
      setPassword("");
      setRole(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNewUser ? "Create New User" : `Update user ${user?.name}`}
          </DialogTitle>
        </DialogHeader>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Name
          </Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <Label className="block text-sm font-medium text-gray-700 mt-4">
            Email
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div className="mt-4">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </Label>
            <Select
              onValueChange={(value) => handleRoleChange(value)}
              value={role?.id?.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allRoles.map((role) => (
                    <SelectItem
                      key={role.id}
                      onClick={() => setRole(role)}
                      className="cursor-pointer"
                      value={role.id.toString()}
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Label className="block text-sm font-medium text-gray-700 mt-4">
            Password
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {!isLoading && <>{isNewUser ? "Save" : "Update"} changes</>}
            {isLoading && <BeatLoader size={8} />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
