import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    nextStep?: string | null;
    user: {
      id?: string;
      reference?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      image?: string;
      role?: string;
      accountType?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    reference?: string;
    accessToken?: string;
    refreshToken?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    accountType?: string;
    nextStep?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    reference?: string;
    accessToken?: string;
    refreshToken?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    accountType?: string;
    nextStep?: string | null;
  }
}
