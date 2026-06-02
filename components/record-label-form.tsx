"use client";

import * as React from "react";

interface RecordLabelFormProps {
  initialData?: {
    labelName: string;
    labelBio: string;
    labelWebsite: string;
  };
}

export default function RecordLabelForm({ initialData }: RecordLabelFormProps) {
  const [labelName, setLabelName] = React.useState(initialData?.labelName || "Coker Creative");
  const [labelBio, setLabelBio] = React.useState(
    initialData?.labelBio ||
      "Visual artist and digital designer based in Lagos, Nigeria. Creating vibrant Afrocentric artwork.",
  );
  const [labelWebsite, setLabelWebsite] = React.useState(
    initialData?.labelWebsite || "www.temilolacoker.com",
  );

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-default-tertiary uppercase tracking-wider pl-1">
            Record Label Name
          </label>
          <input
            type="text"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-default-tertiary uppercase tracking-wider pl-1">
            Website
          </label>
          <input
            type="text"
            value={labelWebsite}
            onChange={(e) => setLabelWebsite(e.target.value)}
            className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-default-tertiary uppercase tracking-wider pl-1">
            Record Label Bio
          </label>
          <textarea
            value={labelBio}
            onChange={(e) => setLabelBio(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all resize-none"
          />
        </div>

        <button className="w-full py-3 bg-brand-orange text-white font-bold rounded-full mt-4 hover:bg-brand-orange/95 shadow-md shadow-brand-orange/20 transition-all">
          Save Details
        </button>
      </form>
    </div>
  );
}
