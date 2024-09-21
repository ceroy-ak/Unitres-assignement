import SystemSettingsService, {
  ISystemSettings,
} from "@/service/system-settings.service";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import UiSettingsUpdateDialog from "./ui-settings.dialog";

export default function SystemSettings() {
  const [allSettings, setAllSettings] = useState<ISystemSettings[]>([]);
  const [selectedSettings, setSelectedSettings] =
    useState<ISystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateUiSettingsDialogOpen, setIsUpdateUiSettingsDialogOpen] =
    useState(false);
  const fetchAllSettings = async () => {
    setIsLoading(true);
    try {
      const allSettings = await SystemSettingsService.getAllSystemSettings();
      setAllSettings(allSettings);
    } catch (error) {
      toast.error("Failed to fetch system settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSettings();
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
      <h1 className="text-2xl font-bold my-5">System Settings</h1>
      <div className="flex items-center flex-wrap gap-5 my-5">
        {allSettings.map((setting, index) => (
          <div
            key={index}
            className="w-[300px] min-h-[400px] border border-gray-300 bg-white p-4 rounded-lg shadow-sm transition-transform transform hover:shadow-md hover:border-gray-400 hover:bg-gray-50"
          >
            <h2 className="text-xl font-bold mb-5">{setting.role.name}</h2>
            <hr />
            <h3 className="font-bold">Menus</h3>
            <ul>
              {setting.menus.map((menu) => (
                <li>{menu.title}</li>
              ))}
            </ul>
            <hr className="my-4" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold">UI Options</p>
                <Edit2
                  size={18}
                  className="hover:scale-110 cursor-pointer"
                  onClick={() => {
                    setIsUpdateUiSettingsDialogOpen(true);
                    setSelectedSettings(setting);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span>
                  <b>Show Header:</b> {setting.ui.showHeader ? "Yes" : "No"}
                </span>
                <span>
                  <b>Show Footer:</b> {setting.ui.showFooter ? "Yes" : "No"}
                </span>
                <span>
                  <b>Show Menu:</b> {setting.ui.showMenu ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <UiSettingsUpdateDialog
        open={isUpdateUiSettingsDialogOpen}
        onClose={() => setIsUpdateUiSettingsDialogOpen(false)}
        onSettingsUpdated={fetchAllSettings}
        systemSettings={selectedSettings!}
      />
    </div>
  );
}
