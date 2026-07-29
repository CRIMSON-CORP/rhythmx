"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type FormErrors = Pick<User, "first_name" | "last_name" | "email" | "phone" | "gender" | "dob">;

function Form(props: FormErrors) {
  const [firstName, setFirstName] = useState(props?.first_name || "");
  const [lastName, setLastName] = useState(props?.last_name || "");
  const [email, setEmail] = useState(props?.email || "");
  const [phone, setPhone] = useState(props?.phone || undefined);
  const [gender, setGender] = useState(props?.gender || "");
  const [dob, setDob] = useState(props?.dob || "");
  const [errors, setErrors] = useState<FormErrors>({
    dob: "",
    email: "",
    first_name: "",
    gender: "",
    last_name: "",
    phone: "",
  });

  const isDirty = useRef(false);
  const hasSyncedSession = useRef(false);

  const router = useRouter();

  // Synchronize state once when session data initially loads
  useEffect(() => {
    if (props && !hasSyncedSession.current) {
      setFirstName(props.first_name || "");
      setLastName(props.last_name || "");
      setEmail(props.email || "");
      setPhone(props.phone || undefined);
      setGender(props.gender || "");
      setDob(props.dob || "");
      hasSyncedSession.current = true;
    }
  }, [props]);

  // Debounced update only when user explicitly edits a field
  useEffect(() => {
    if (!isDirty.current) return;

    const timer = setTimeout(async () => {
      try {
        setErrors({ dob: "", email: "", first_name: "", gender: "", last_name: "", phone: "" });
        await api.patch(API_ROUTES.USER.ME, {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          gender: gender || null,
          dob: dob || null,
        });

        isDirty.current = false;
        router.refresh();
        goeyToast.success("Profile Updated!");
      } catch (error: unknown) {
        console.error("[Debounced Profile Update Failed]:", error);
        setErrors(error as FormErrors);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [firstName, lastName, email, phone, router, gender, dob]);

  return (
    <form className="flex flex-col gap-4 p-4 md:p-6 bg-white" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-default-tertiary">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => {
            isDirty.current = true;
            setFirstName(e.target.value);
            setErrors((prev) => ({ ...prev, first_name: "" }));
          }}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
        {errors.first_name && <p className="text-red-500 text-xs mt-0.5">{errors.first_name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-default-tertiary">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => {
            isDirty.current = true;
            setLastName(e.target.value);
            setErrors((prev) => ({ ...prev, last_name: "" }));
          }}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
        {errors.last_name && <p className="text-red-500 text-xs mt-0.5">{errors.last_name}</p>}
      </div>

      <div className="flex flex-col gap-2 col-span-2">
        <label className="text-[11px] font-bold text-default-tertiary">Email</label>
        <input
          type="email"
          readOnly
          value={email}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
      </div>

      <div className="flex flex-col gap-2 col-span-2">
        <label className="text-[11px] font-bold text-default-tertiary uppercase tracking-wider pl-1">
          Phone
        </label>
        <PhoneInput
          placeholder="Enter phone number"
          value={phone}
          onChange={(val) => {
            if (hasSyncedSession.current) {
              isDirty.current = true;
            }
            setPhone(val);
            setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          className="rounded-xl border border-default/10 px-4 py-3 [&_input]:outline-none"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
      </div>
      <div className="flex flex-col gap-2 col-span-2">
        <label className="text-[11px] font-bold text-default-tertiary uppercase tracking-wider pl-1">
          Gender
        </label>
        <Select value={gender} onValueChange={(val) => setGender(val)}>
          <SelectTrigger className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && <p className="text-red-500 text-xs mt-0.5">{errors.gender}</p>}
      </div>
      <div className="flex flex-col gap-2 col-span-2">
        <label className="text-[11px] font-bold text-default-tertiary uppercase tracking-wider pl-1">
          Date of Birth
        </label>
        <input
          type="date"
          value={dob}
          onChange={(e) => {
            isDirty.current = true;
            setDob(e.target.value);
            setErrors((prev) => ({ ...prev, dob: "" }));
          }}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
        {errors.dob && <p className="text-red-500 text-xs mt-0.5">{errors.dob}</p>}
      </div>
    </form>
  );
}

export default Form;
