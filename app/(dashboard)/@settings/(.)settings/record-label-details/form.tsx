"use client";

import Icon from "@/components/icon";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-phone-number-input/style.css";
import { getErrorMessage, getFieldErrors } from "@/lib/utils";

interface FormProps {
  labelName?: string;
  labelAbout?: string;
  fundingDate?: string;
  licenseNumber?: string;
}

interface FormErrors {
  name?: string;
  about?: string;
  funding_date?: string;
  license_number?: string;
}

function Form(initialData: FormProps) {
  const [labelName, setLabelName] = useState(initialData?.labelName || "");
  const [labelAbout, setLabelAbout] = useState(initialData?.labelAbout || "");
  const [fundingDate, setFundingDate] = useState(initialData?.fundingDate || "");
  const [licenceNumber, setLicenceNumber] = useState(initialData?.licenseNumber || "");
  const [errors, setErrors] = useState<FormErrors>({});

  const isDirty = useRef(false);
  const hasSyncedInitial = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (initialData && !hasSyncedInitial.current) {
      setLabelName(initialData.labelName || "");
      setLabelAbout(initialData.labelAbout || "");
      setFundingDate(initialData.fundingDate || "");
      setLicenceNumber(initialData.licenseNumber || "");
      hasSyncedInitial.current = true;
    }
  }, [initialData]);

  const submitForm = useCallback(async () => {
    try {
      setErrors({});
      await api.patch(API_ROUTES.LABEL.INDEX, {
        name: labelName,
        about: labelAbout,
        license_number: licenceNumber || null,
      });

      isDirty.current = false;
      router.refresh();
      goeyToast.success("Label details updated!");
    } catch (error: unknown) {
      console.error("[Label Details Update Failed]:", error);
      setErrors(getFieldErrors<FormErrors>(error));
      goeyToast.error("Failed to update label details", {
        description: getErrorMessage(error, "Please check the form for errors."),
      });
    }
  }, [labelAbout, labelName, licenceNumber, router]);

  // Debounced auto-save when user stops typing
  useEffect(() => {
    if (!isDirty.current) return;

    const timer = setTimeout(async () => {
      await submitForm();
    }, 1500);

    return () => clearTimeout(timer);
  }, [labelName, labelAbout, licenceNumber, submitForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDirty.current) {
      await submitForm();
    }
  };

  return (
    <form className="flex flex-col gap-4 p-4 md:p-6 bg-white" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-default-tertiary">Label Name</label>
        <input
          type="text"
          value={labelName}
          onChange={(e) => {
            isDirty.current = true;
            setLabelName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
        {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-default-tertiary">About Label</label>
        <div className="flex flex-col gap-2.5 w-full rounded-xl border border-default/10 p-4 text-sm text-default font-medium">
          <textarea
            value={labelAbout}
            rows={4}
            onChange={(e) => {
              isDirty.current = true;
              setLabelAbout(e.target.value);
              setErrors((prev) => ({ ...prev, about: "" }));
            }}
            className="w-full resize-none text-sm text-default border-b border-b-default/10 font-medium outline-none transition-all"
          />
          {errors.about && <p className="text-red-500 text-xs mt-0.5">{errors.about}</p>}
          <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
            <Icon name="info-square" size={18} />
            <span className="text-default-tertiary">Keep it detailed</span>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 col-span-2">
        <label className="text-[11px] font-bold text-default-tertiary">Funding Date</label>
        <input
          type="date"
          disabled
          readOnly
          value={fundingDate}
          className="w-full bg-[#F5F5F5] rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none cursor-not-allowed"
        />
      </div> */}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-default-tertiary">Licence Number</label>
        <input
          type="text"
          value={licenceNumber}
          onChange={(e) => {
            isDirty.current = true;
            setLicenceNumber(e.target.value);
            setErrors((prev) => ({ ...prev, license_number: "" }));
          }}
          className="w-full rounded-xl border border-default/10 px-4 py-3 text-sm text-default font-medium outline-none focus:border-brand-orange transition-all"
        />
        {errors.license_number && (
          <p className="text-red-500 text-xs mt-0.5">{errors.license_number}</p>
        )}
      </div>
    </form>
  );
}

export default Form;
