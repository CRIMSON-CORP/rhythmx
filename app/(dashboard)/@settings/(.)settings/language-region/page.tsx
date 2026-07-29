import Icon from "@/components/icon";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export default async function LanguageSettingsPage() {
  const { timezones } = await api.get<{ timezones: TimeZone[] }>(API_ROUTES.META.TIMEZONES);

  return (
    <div className="flex flex-col gap-6">
      {/* Current Language */}
      <div className="px-3 md:px-8 pt-4">
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10.5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0">
              <Icon name="language-circle" size={24} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-medium text-border-default-secondary">English UK</h4>
              <p className="font-medium text-default">Your Language</p>
            </div>
          </div>
          <button
            type="button"
            className="self-start text-brand-blue text-xs font-medium hover:underline cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>

      {/* Region Settings */}
      <div className="flex flex-col gap-4 px-3 md:px-8 pb-8">
        <h3 className="font-medium">Region</h3>

        {/* Current Region Card */}
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl shrink-0">🇳🇬</span>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-medium text-border-default-secondary">Lagos, Nigeria</h4>
              <p className="font-medium text-default">Your Region</p>
            </div>
          </div>
        </div>

        {/* Timezones list */}
        <div className="bg-white p-5 rounded-2xl flex flex-col gap-5">
          {timezones.map((tz) => (
            <div key={tz.slug || tz.label} className="flex items-center gap-4">
              <span className="text-sm font-medium text-default">{tz.label}</span>
            </div>
          ))}
          {timezones.length === 0 && (
            <p className="text-sm text-default-tertiary">No timezones available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
