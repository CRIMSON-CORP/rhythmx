import useOnBoardingStore from "@/store/onboarding-store";
import Option from "../option";
import { Button } from "@/components/ui/button";

function AccountType() {
  const selected_account = useOnBoardingStore((state) => state.form.selected_account);
  const setForm = useOnBoardingStore((state) => state.setForm);
  const nextStep = useOnBoardingStore((state) => state.next);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-[32px] font-medium text-black leading-tight">Let&apos;s get started</h1>
        <h2 className="text-2xl font-medium text-black/50 leading-tight">
          This helps customize your experience
        </h2>
      </div>
      <div className="space-y-6">
        <Option
          value="record-label"
          checked={selected_account === "record-label"}
          onChange={() => setForm({ selected_account: "record-label" })}
        />
        <Option
          value="artist"
          checked={selected_account === "artist"}
          onChange={() => setForm({ selected_account: "artist" })}
        />
        <Option
          value="contributor"
          checked={selected_account === "contributor"}
          onChange={() => setForm({ selected_account: "contributor" })}
        />
      </div>
      <Button
        rounded={10}
        width="full"
        type="button"
        onClick={nextStep}
        disabled={!selected_account}
      >
        Continue
      </Button>
    </div>
  );
}

export default AccountType;
