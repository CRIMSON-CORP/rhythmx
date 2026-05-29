"use client";
import Icon from "@/components/icon";
import useToggle from "@/hooks/useToggle";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "email" | "number" | "password";
  name: string;
  label: string;
  placeholder?: string;
}

function Input({ type = "text", name, label, ...props }: InputProps) {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      <div className="bg-white outline outline-[#D9D9D9] p-4 rounded-10 flex items-center gap-2">
        <input
          id={name}
          type={type === "password" && isOpen ? "text" : type}
          name={name}
          {...props}
          className="w-full outline-none placeholder:text-black/50"
        />
        {type === "password" ? (
          <button type="button" onClick={toggle}>
            {isOpen ? <Icon name="eye-slash" size={16} /> : <Icon name="eye" size={16} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Input;
