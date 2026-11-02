import Form from "./form";
import LogoUpload from "./image-upload";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export default async function AccountForm() {
  const { label: labelDetails } = await api.get<LabelDetailsResponse>(API_ROUTES.LABEL.INDEX);

  return (
    <div className="flex flex-col">
      {/* Profile Details Header with Logo Upload */}
      <LogoUpload
        logoUrl={labelDetails.logo_url}
        name={labelDetails.name}
        isVerified={labelDetails.is_verified}
      />

      {/* Input Fields */}
      <Form labelName={labelDetails.name} licenseNumber={""} fundingDate={""} labelAbout="" />
    </div>
  );
}
