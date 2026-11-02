import PermissionsForm from "@/components/permissions-form";

interface PageProps {
  params: Promise<{
    role_id: string;
  }>;
}

export default async function RoleDetailPage({ params }: PageProps) {
  const { role_id } = await params;

  return (
    <div className="bg-white overflow-hidden relative isolate rounded-30 p-6 flex flex-col min-h-160">
      {/* Background gradient blur */}
      <div className="absolute w-full top-0 left-0 right-0 h-1/3 bg-linear-to-r from-[#00F2EA]/50 to-[#8A38F5]/50 -z-10 opacity-25 blur-3xl pointer-events-none"></div>

      <PermissionsForm roleId={role_id} />
    </div>
  );
}
