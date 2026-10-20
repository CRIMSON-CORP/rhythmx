import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    refresh_token?: string;
    next_step?: string | null;
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
      account_type?: string;
      next_step?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    reference?: string;
    access_token?: string;
    refresh_token?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    avatar_url?: string;
    phone?: string;
    role?: string;
    account_type?: string;
    next_step?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    reference?: string;
    access_token?: string;
    refresh_token?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    avatar_url?: string;
    phone?: string;
    role?: string;
    account_type?: string;
    next_step?: string | null;
  }
}
