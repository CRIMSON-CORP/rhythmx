import useOnBoardingStore, {
  accountTypeIconMap,
  accountTypeOptionContentMap,
} from "@/store/onboarding-store";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";

function Logo() {
  const selected_account = useOnBoardingStore((state) => state.form.selected_account);
  const name = useOnBoardingStore((state) => state.form.name);
  const country = useOnBoardingStore((state) => state.form.country);
  const avatar = useOnBoardingStore((state) => state.form.avatar);
  const setForm = useOnBoardingStore((state) => state.setForm);
  const nextStep = useOnBoardingStore((state) => state.next);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-[32px] font-medium text-black leading-tight">Welcome onboard</h1>
        <h2 className="text-2xl font-medium text-black/50 leading-tight">
          {name} {selected_account === "record-label" ? "Record" : ""}, {country}
        </h2>
      </div>
      <div className="space-y-6">
        <div className="rounded-30 cursor-pointer outline outline-default-default has-checked:outline-brand-orange/10 has-checked:bg-brand-orange/10 px-6 py-7 w-full flex items-center gap-4 transition-colors duration-200">
          <Icon name={accountTypeIconMap[selected_account]} size={32} />
          <div className="grow font-medium space-y-1">
            <p className="text-lg leading-tight">
              {accountTypeOptionContentMap[selected_account]?.title}
            </p>
            <p className="leading-tight text-black/50">
              {accountTypeOptionContentMap[selected_account]?.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center flex-col gap-2 py-4">
          <div className="w-26 aspect-square flex items-center justify-center rounded-full bg-default-secondary">
            <Icon name="user-square" size={48} />
          </div>
          <label
            htmlFor="avatar"
            className="outline outline-neutral-default rounded-10 p-1.5 flex items-center gap-2.5 font-medium text-xs"
          >
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="hidden"
              onChange={(event) => setForm({ avatar: event.target.files?.[0] })}
            />
            <Icon name="image" size={20} />
            <span className="text-default">Add Logo</span>
          </label>
        </div>
      </div>
      <Button rounded={10} width="full" type="button" onClick={nextStep} disabled={!avatar}>
        Continue
      </Button>
    </div>
  );
}

export default Logo;
