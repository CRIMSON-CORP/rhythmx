import Image from "next/image";
import Icon from "@/components/icon";
import Form from "./form";

export default async function AccountForm() {
  const initialData: AccountFormProps = {
    firstName: "Temilola",
    lastName: "Coker",
    email: "[EMAIL_ADDRESS]",
    phone: "",
    countryCode: "",
    labelName: "",
    labelAbout: "",
    fundingDate: "",
    licenseNumber: "",
  };
  return (
    <div className="flex flex-col">
      {/* Profile Details Header */}
      <div className="flex items-center gap-5 border-b border-b-default-default px-6 py-7.5">
        <div className="relative size-19.25 overflow-hidden rounded-full">
          <Image
            src="/images/avatar.png"
            alt="Profile Avatar"
            width={77}
            height={77}
            className="rounded-full bg-[#C7FFB3] object-cover"
          />
          <button className="absolute text-white inset-0 flex justify-center items-center bg-black/20">
            <Icon name="plus" size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xl text-default">
            {initialData?.firstName} {initialData?.lastName}
          </span>
          <div className="flex items-center gap-2 bg-[#CFF7D3] text-positive-secondary rounded-full p-2 w-fit">
            <span className="leading-none">Verified</span>
            <Icon name="seal-check" size={16} />
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <Form {...initialData} />
      {/* Update Password Action Card */}
      <footer className="px-6 py-4 mt-2 bg-page-background">
        <button className="w-full bg-white flex gap-3 p-3 rounded-20 text-left">
          <Icon name="lock" size={20} />
          <div className="flex flex-col">
            <span className="font-medium text-default leading-tight">Update Password</span>
            <span className="text-xs font-medium text-default-tertiary leading-tight">
              Secure your account if you feel your password has been compromised
            </span>
          </div>
        </button>
      </footer>
    </div>
  );
}
