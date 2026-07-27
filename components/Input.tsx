"use client";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import useToggle from "@/hooks/useToggle";
import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "email" | "number" | "password";
  name: string;
  label: string;
  placeholder?: string;
  error?: string;
  prefilled?: boolean;
}

function Input({ type = "text", name, label, error, prefilled, ...props }: InputProps) {
  const [isOpen, toggle] = useToggle(false);

  return (
    <Field>
      <FieldLabel htmlFor={props.id || name}>{label}</FieldLabel>
      <InputGroup
        data-prefilled={prefilled}
        className="bg-white outline outline-[#D9D9D9] p-4 rounded-10 flex items-center gap-2 data-[prefilled=true]:outline-none data-[prefilled=true]:border-none data-[prefilled=true]:bg-[#EBFFEE]"
      >
        <InputGroupInput
          id={name}
          name={name}
          type={type === "password" && isOpen ? "text" : type}
          className="w-full outline-none placeholder:text-black/50"
          {...props}
        />
        {type === "password" ? (
          <button type="button" onClick={toggle}>
            <InputGroupAddon align="inline-end">
              {isOpen ? <EyeOff size={16} /> : <Eye size={16} />}
            </InputGroupAddon>
          </button>
        ) : null}
      </InputGroup>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export default Input;
