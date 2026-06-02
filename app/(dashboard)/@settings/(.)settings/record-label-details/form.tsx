"use client";
import Icon from "@/components/icon";
import { useState } from "react";
import "react-phone-number-input/style.css";

function Form(initialData: AccountFormProps) {
  const [labelName, setLabelName] = useState(initialData?.labelName || "Temilola");
  const [labelAbout, setLabelAbout] = useState(initialData?.labelAbout || "Coker");
  const [fundingDate, setFundingDate] = useState(initialData?.fundingDate || "1994-05-12");
  const [licenceNumber, setLicenceNumber] = useState(initialData?.licenseNumber || undefined);
  return (
    <form className="flex flex-col gap-4 p-6 bg-white" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-default-tertiary">Label Name</label>
        <input
          type="text"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-default-tertiary">About Label</label>
        <div className="flex flex-col gap-2.5 w-full rounded-xl border border-default/10 p-4 text-sm text-default font-medium">
          <textarea
            value={labelAbout}
            rows={4}
            onChange={(e) => setLabelAbout(e.target.value)}
            className="w-full resize-none text-sm text-default border-b border-b-default/10 font-medium outline-none transition-all"
          />
          <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
            <Icon name="info-square" size={18} />
            <span className="text-default-tertiary">Keep it detailed</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 col-span-2">
        <label className="text-[11px] font-bold text-default-tertiary">Funding Date</label>
        <input
          type="date"
          disabled
          value={fundingDate}
          onChange={(e) => setFundingDate(e.target.value)}
          className="w-full bg-[#F5F5F5] rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-default-tertiary">Licence Number</label>
        <input
          type="text"
          value={licenceNumber}
          onChange={(e) => setLicenceNumber(e.target.value)}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
      </div>
    </form>
  );
}

export default Form;
