import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    nextStep?: string | null;
    user: {
      id?: string;
      reference?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      image?: string;
      avatar?: string;
      avatar_url?: string;
      phone?: string;
      role?: string;
      accountType?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    reference?: string;
    accessToken?: string;
    refreshToken?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    avatar_url?: string;
    phone?: string;
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
    first_name?: string;
    last_name?: string;
    avatar?: string;
    avatar_url?: string;
    phone?: string;
    role?: string;
    accountType?: string;
    nextStep?: string | null;
  }
}
