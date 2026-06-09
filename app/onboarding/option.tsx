import Icon from "@/components/icon";
import {
  AccountType,
  accountTypeIconMap,
  accountTypeOptionContentMap,
} from "@/store/onboarding-store";
import { InputHTMLAttributes } from "react";

interface OptionProps {
  value: AccountType;
  checked: boolean;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
}

function Option({ value, checked, onChange }: OptionProps) {
  return (
    <label
      htmlFor={value}
      className="rounded-30 cursor-pointer outline outline-default-default has-checked:outline-brand-orange/10 has-checked:bg-brand-orange/10 hover:bg-brand-orange/10 px-6 py-7 w-full flex items-center gap-4 transition-colors duration-200"
    >
      <input
        type="radio"
        name="account-type"
        value={value}
        id={value}
        hidden
        className="peer"
        checked={checked}
        onChange={onChange}
      />
      <Icon name={accountTypeIconMap[value]} size={32} />
      <div className="grow font-medium space-y-1">
        <p className="text-lg leading-tight">{accountTypeOptionContentMap[value].title}</p>
        <p className="leading-tight text-black/50">{accountTypeOptionContentMap[value].subtitle}</p>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="peer-checked:opacity-100 opacity-0 transition-opacity duration-200"
      >
        <path
          d="M2.5 12C2.5 7.522 2.5 5.282 3.891 3.891C5.282 2.5 7.521 2.5 12 2.5C16.478 2.5 18.718 2.5 20.109 3.891C21.5 5.282 21.5 7.521 21.5 12C21.5 16.478 21.5 18.718 20.109 20.109C18.718 21.5 16.479 21.5 12 21.5C7.522 21.5 5.282 21.5 3.891 20.109C2.5 18.718 2.5 16.479 2.5 12Z"
          fill="#FF4907"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12.5L10.5 15L16 9"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </label>
  );
}

export default Option;
