import useOnBoardingStore, {
  accountTypeIconMap,
  accountTypeOptionContentMap,
  accountTypeTitle,
} from "@/store/onboarding-store";
import type { AccountType as LabelName } from "@/store/onboarding-store";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import Input from "@/components/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { memo, useState, useEffect } from "react";

const CountrySelect = memo(function CountrySelect() {
  const country = useOnBoardingStore((state) => state.form.country);
  const setForm = useOnBoardingStore((state) => state.setForm);
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("/countries.json");
      const data = await res.json();
      setCountries(data);
    };
    fetchCountries();
  }, []);

  return (
    <Select onValueChange={(value) => setForm({ country: value })} value={country}>
      <SelectTrigger className="w-full p-4 rounded-10">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
});

function LabelName() {
  const form = useOnBoardingStore((state) => state.form);
  const setForm = useOnBoardingStore((state) => state.setForm);
  const nextStep = useOnBoardingStore((state) => state.next);
  const currentStep = useOnBoardingStore((state) => state.currentStep);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-[32px] font-medium text-black leading-tight">
          What&apos;s your {accountTypeTitle[form.selected_account]} name?
        </h1>
        <h2 className="text-2xl font-medium text-black/50 leading-tight">Gracias!</h2>
      </div>
      <div className="space-y-6">
        <div className="rounded-[30px] cursor-pointer outline outline-default-default has-checked:outline-brand-orange/10 has-checked:bg-brand-orange/10 px-6 py-7 w-full flex items-center gap-4 transition-colors duration-200">
          <Icon name={accountTypeIconMap[form.selected_account]} size={32} />
          <div className="grow font-medium space-y-1">
            <p className="text-lg leading-tight">
              {accountTypeOptionContentMap[form.selected_account]?.title}
            </p>
            <p className="leading-tight text-black/50">
              {accountTypeOptionContentMap[form.selected_account]?.subtitle}
            </p>
          </div>
        </div>
        <Input
          label={`Enter your ${accountTypeTitle[form.selected_account]}`}
          name="name"
          placeholder={`${accountTypeTitle[form.selected_account]} Name`}
          onChange={(e) => setForm({ name: e.target.value })}
          value={form.name}
        />
        {currentStep == 1 && <CountrySelect />}
      </div>
      <Button type="button" onClick={nextStep} disabled={!(form.name && form.country)}>
        Continue
      </Button>
    </div>
  );
}

export default LabelName;
