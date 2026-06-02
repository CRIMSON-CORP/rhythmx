import { Switch } from "@/components/ui/switch";

export default function SecurityPrivacyPage() {
  return (
    <div className="flex flex-col gap-4 px-8 pt-4 pb-8">
      {/* 2-step verification */}
      <div className="bg-white p-4.5 rounded-2xl flex items-center justify-between">
        <div className="flex flex-col gap-1 pr-6">
          <h4 className="font-medium text-default">2-step verification</h4>
          <p className="text-xs text-grey font-semibold">
            Add an additional layer of security to your account during login.
          </p>
        </div>
        <Switch defaultChecked={false} />
      </div>

      {/* Pass Key */}
      <div className="bg-white p-4.5 rounded-2xl flex items-center justify-between">
        <div className="flex flex-col gap-1 pr-6">
          <h4 className="font-medium text-default">Pass Key</h4>
          <p className="text-xs text-grey font-semibold">
            Securely sign-in with on-device biometric authentication.
          </p>
        </div>
        <button
          type="button"
          className="self-start text-brand-blue text-xs font-medium hover:underline cursor-pointer shrink-0"
        >
          Add Passkey
        </button>
      </div>

      {/* Disable Export */}
      <div className="bg-white p-4.5 rounded-2xl flex items-center justify-between">
        <div className="flex flex-col gap-1 pr-6">
          <h4 className="font-medium text-default">Disable Export</h4>
          <p className="text-xs text-grey font-semibold">
            Prevent unauthorized downloads of your content.
          </p>
        </div>
        <Switch defaultChecked={false} />
      </div>
    </div>
  );
}
