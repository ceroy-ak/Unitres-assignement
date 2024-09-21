import { Button } from "@/components/ui/button";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SystemSettingsService, {
  ISystemSettings,
} from "@/service/system-settings.service";
import { Label } from "@radix-ui/react-label";
import { SelectGroup } from "@radix-ui/react-select";

import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

interface UiSettingsUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  onSettingsUpdated?: () => void;
  systemSettings: ISystemSettings;
}
export default function UiSettingsUpdateDialog({
  onClose,
  open,
  systemSettings,
  onSettingsUpdated,
}: UiSettingsUpdateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    if (systemSettings) {
      setShowHeader(systemSettings.ui.showHeader);
      setShowFooter(systemSettings.ui.showFooter);
      setShowMenu(systemSettings.ui.showMenu);
    }
  }, [systemSettings]);
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await SystemSettingsService.updateUISettings({
        roleId: systemSettings.role.id,
        showHeader,
        showFooter,
        showMenu,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update UI settings");
    } finally {
      setIsLoading(false);
      onSettingsUpdated && onSettingsUpdated();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update UI Option</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Label className="mt-1">Show Header</Label>
          <Select
            value={showHeader ? "Yes" : "No"}
            onValueChange={(val) => {
              if (val === "Yes") {
                setShowHeader(true);
              } else {
                setShowHeader(false);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Show Header" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label className="mt-4">Show Footer</Label>
          <Select
            value={showFooter ? "Yes" : "No"}
            onValueChange={(val) => {
              if (val === "Yes") {
                setShowFooter(true);
              } else {
                setShowFooter(false);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Show Footer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label className="mt-1">Show Menu</Label>
          <Select
            value={showMenu ? "Yes" : "No"}
            onValueChange={(val) => {
              if (val === "Yes") {
                setShowMenu(true);
              } else {
                setShowMenu(false);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Show Menu" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
