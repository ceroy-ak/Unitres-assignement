import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import SystemSettingsService from "@/service/system-settings.service";
import { Label } from "@radix-ui/react-label";

import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

interface AddMenuDialogProps {
  open: boolean;
  onClose: () => void;
  onMenuUpdated?: () => void;
  roleId: number;
}
export default function AddMenuDialog({
  onClose,
  open,
  onMenuUpdated,
  roleId,
}: AddMenuDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [menuRoute, setMenuRoute] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await SystemSettingsService.addMenuForRole(roleId, menuName, menuRoute);
      onMenuUpdated && onMenuUpdated();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update UI settings");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleClose = () => {
    setMenuName("");
    setMenuRoute("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Menu</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Label>Menu Name</Label>
          <Input
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
          />
          <Label>Menu Route</Label>
          <Input
            value={menuRoute}
            onChange={(e) => setMenuRoute(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {!isLoading && <>Save changes</>}
            {isLoading && <BeatLoader size={8} />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
