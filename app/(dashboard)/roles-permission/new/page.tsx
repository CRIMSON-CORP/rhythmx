import PermissionsForm from "@/components/permissions-form";

export default function NewRolePage() {
  return (
    <div className="bg-white overflow-hidden relative isolate rounded-30 p-6 md:p-8 flex flex-col min-h-[450px]">
      {/* Background gradient blur */}
      <div className="absolute w-full top-0 left-0 right-0 h-1/3 bg-linear-to-r from-[#00F2EA]/50 to-[#8A38F5]/50 -z-10 opacity-25 blur-3xl pointer-events-none"></div>
      <PermissionsForm />
    </div>
  );
}
