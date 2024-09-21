import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SystemSettingsService, {
  ISystemSettings,
} from "@/service/system-settings.service";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import AddMenuDialog from "./add-menu.dialog";
import { useState } from "react";

interface IMenuSettingsSheetProps {
  open: boolean;
  onClose: () => void;
  onMenusUpdated: () => void;
  systemSettings: ISystemSettings;
}

export default function MenuSettingsSheet({
  onClose,
  onMenusUpdated,
  open,
  systemSettings,
}: IMenuSettingsSheetProps) {
  const [isAddMenuDialogOpen, setIsAddMenuDialogOpen] = useState(false);
  const handleClose = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // const onMenusUpdated = () => {};

  const deleteMenu = async (menuId: number) => {
    try {
      await SystemSettingsService.deleteMenuForRole(
        systemSettings.role.id,
        menuId
      );
      toast.success("Menu deleted successfully");
      onMenusUpdated && onMenusUpdated();
    } catch (error) {
      toast.error("Failed to delete menu");
      console.error(error);
    }
  };
  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menus</SheetTitle>
            <SheetDescription>
              Below is the list of all the menus available for the selected
              role.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-5">
            <div className="flex flex-col gap-5">
              {systemSettings?.menus?.map((menu, index) => (
                <div className="flex items-center justify-between">
                  <p key={`${index}-${menu.route}`}>{menu.title}</p>
                  <Trash2
                    size={18}
                    className="hover:scale-110 cursor-pointer"
                    onClick={() => deleteMenu(menu.id)}
                  />
                </div>
              ))}
            </div>
          </div>
          <SheetFooter className="">
            <Button
              className="mt-5"
              onClick={() => setIsAddMenuDialogOpen(true)}
            >
              Add new Menu
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <AddMenuDialog
        open={isAddMenuDialogOpen}
        onClose={() => setIsAddMenuDialogOpen(false)}
        onMenuUpdated={onMenusUpdated}
        roleId={systemSettings.role.id}
      />
    </>
  );
}
