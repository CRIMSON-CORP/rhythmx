import { Search } from "lucide-react";
import SignOutAllDevices from "./sign-out-all-devices";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { formatDate } from "@/lib/date-formatter";
import SignOutButton from "./sign-out-button";

export default async function DevicesSettingsPage() {
  const { devices } = await api.get<{ devices: Array<Device> }>(API_ROUTES.ME.DEVICES.INDEX);

  return (
    <div className="flex flex-col gap-6 h-full overflow-auto">
      {/* Log out all devices */}
      <div className="px-3 md:px-8 pt-4">
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex flex-col gap-3">
            <h4 className="font-medium">Log out of all devices</h4>
            <p className="text-xs text-default font-medium">
              Log out of all other active sessions on other devices besides this one.
            </p>
          </div>
          <SignOutAllDevices />
        </div>
      </div>

      {/* Devices Section */}
      <div className="flex flex-col gap-4 px-3 md:px-8 pb-8 overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Devices</h3>

          {/* Search box */}
          <div className="flex items-center gap-2.5 px-4 py-3 text-sm text-border-default-secondary w-full max-w-60">
            <Search size={16} className="text-default-tertiary" />
            <input
              type="text"
              placeholder="Search devices"
              className="bg-transparent outline-none w-full text-xs font-medium placeholder-grey text-default"
            />
          </div>
        </div>

        {/* Devices table */}
        <div className="bg-white rounded-2xl overflow-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse overflow-auto">
              <thead>
                <tr className="border-b border-black/5 font-medium text-default/50 text-xs">
                  <th className="py-4 px-6">Device Name</th>
                  <th className="py-4 px-6">Last Used</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-right">...</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/3">
                {devices.map((device, idx) => (
                  <tr
                    key={idx}
                    className="text-xs text-default font-medium hover:bg-black/1 transition-colors"
                  >
                    <td className="py-4.5 px-6">{device.name}</td>
                    <td className="py-4.5 px-6 text-grey">{formatDate(device.last_login_at)}</td>
                    <td className="py-4.5 px-6 text-grey">{device.location}</td>
                    <td className="py-4.5 px-6 text-right">
                      {device.is_current ? (
                        "Current Device"
                      ) : (
                        <SignOutButton device_id={device.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
