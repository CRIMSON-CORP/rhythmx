"use client";

import { createContext, useContext, ReactNode } from "react";

interface RolesContextType {
  roles: RoleItem[];
  catalogue: RoleCatalogueGroup[];
}

const RolesContext = createContext<RolesContextType | null>(null);

interface RolesProviderProps {
  initialRoles?: RoleItem[];
  initialCatalogue?: RoleCatalogueGroup[];
  children: ReactNode;
}

export function RolesProvider({
  initialRoles = [],
  initialCatalogue = [],
  children,
}: RolesProviderProps) {
  return (
    <RolesContext.Provider value={{ roles: initialRoles, catalogue: initialCatalogue }}>
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles(): RolesContextType {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error("useRoles must be used within a RolesProvider");
  }
  return context;
}
