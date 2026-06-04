"use client";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function Form(initialData: AccountFormProps) {
  const [firstName, setFirstName] = useState(initialData?.firstName || "Temilola");
  const [lastName, setLastName] = useState(initialData?.lastName || "Coker");
  const [email, setEmail] = useState(initialData?.email || "littletemi@gmail.com");
  const [phone, setPhone] = useState(initialData?.phone || undefined);
  return (
    <form className="flex flex-col gap-4 p-4 md:p-6 bg-white" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-default-tertiary">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-default-tertiary">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
      </div>

      <div className="flex flex-col gap-2 col-span-2">
        <label className="text-[11px] font-bold text-default-tertiary">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={setPhone}
          className="rounded-xl border border-default/10 px-4 py-3 [&_input]:outline-none"
        />
      </div>
    </form>
  );
}

export default Form;
