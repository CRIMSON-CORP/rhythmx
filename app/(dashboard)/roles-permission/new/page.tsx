import RolesSidebar from "@/components/roles-sidebar";
import PermissionsForm from "@/components/permissions-form";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function NewRolePage({ searchParams }: PageProps) {
  const { search } = await searchParams;
  const searchQuery = search || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_0.55fr] gap-8 items-stretch pb-10">
      {/* Left Column: Roles Sidebar */}
      <RolesSidebar searchQuery={searchQuery} />

      {/* Right Column: Create Form */}
      <div className="bg-white overflow-hidden relative isolate rounded-30 p-6 md:p-8 flex flex-col min-h-[450px]">
        {/* Background gradient blur */}
        <div className="absolute w-full top-0 left-0 right-0 h-1/3 bg-linear-to-r from-[#00F2EA]/50 to-[#8A38F5]/50 -z-10 opacity-25 blur-3xl pointer-events-none"></div>

        <PermissionsForm />
      </div>
    </div>
  );
}
