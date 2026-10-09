import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RolesSidebar from "./roles-sidebar";
import { RolesProvider } from "./roles-provider";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialRoles: RoleItem[] = [];
  let initialCatalogue: RoleCatalogueGroup[] = [];

  try {
    const res = await api.get<LabelRolesResponse>(API_ROUTES.LABEL.ROLES);
    if (res?.roles) {
      initialRoles = res.roles;
    }
    if (res?.catalogue) {
      initialCatalogue = res.catalogue;
    }
  } catch (error) {
    console.error("Failed to fetch roles on server:", error);
  }

  return (
    <RolesProvider initialRoles={initialRoles} initialCatalogue={initialCatalogue}>
      <div className="flex flex-col gap-6 h-full overflow-auto">
        <div className="container flex flex-wrap items-center justify-between gap-6">
          <h1 className="font-heading text-3xl md:text-5xl leading-tight font-semibold flex items-center gap-2.5 text-default">
            <span>Roles & Permission</span>
          </h1>
          <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
            <Button asChild>
              <Link href="/roles-permission/new">
                <span className="leading-tight">New Role</span>
                <Plus size={16} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="container h-full overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_0.55fr] gap-8 items-stretch pb-10 h-full overflow-auto">
            <RolesSidebar />
            {children}
          </div>
        </div>
      </div>
    </RolesProvider>
  );
}
