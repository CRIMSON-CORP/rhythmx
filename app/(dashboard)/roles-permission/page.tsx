import Image from "next/image";
import RolesSidebar from "@/components/roles-sidebar";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function RolesAndPermissionsPage({ searchParams }: PageProps) {
  const { search } = await searchParams;
  const searchQuery = search || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_0.55fr] gap-8 items-stretch pb-10">
      {/* Left Column: Roles Sidebar */}
      <RolesSidebar searchQuery={searchQuery} />

      {/* Right Column: Empty State View */}
      <div className="bg-white overflow-hidden relative isolate rounded-30 p-6 md:p-8 flex flex-col justify-center items-center min-h-[450px]">
        {/* Background gradient blur */}
        <div className="absolute w-full top-0 left-0 right-0 h-1/3 bg-linear-to-r from-[#00F2EA]/50 to-[#8A38F5]/50 -z-10 opacity-25 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <Image
            src="/images/old-computer-with-sprouted-clover.png"
            width={120}
            height={120}
            alt="No Roles Selected"
            className="object-contain animate-bounce-slow"
          />
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-medium text-black">No Roles Selected</h2>
            <p className="text-sm text-default/50 font-medium">
              Select a role to view details and permissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
