import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { API_ROUTES } from "@/lib/api-routes";
import { api } from "@/lib/api";

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        userAgent: { label: "User Agent", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          let userAgent: string | undefined = credentials.userAgent || undefined;
          if (!userAgent) {
            try {
              const { headers } = await import("next/headers");
              const reqHeaders = await headers();
              userAgent = reqHeaders.get("user-agent") || undefined;
            } catch {
              // not available
            }
          }
          const endpoint = credentials.otp
            ? API_ROUTES.AUTH.EMAIL_VERIFICATION
            : API_ROUTES.AUTH.LOGIN;
          const payload = credentials.otp
            ? { email: credentials.email, otp: credentials.otp, userAgent }
            : { email: credentials.email, password: credentials.password, userAgent };

          const data = await api.post<VerifyResponse>(endpoint, payload);

          if (data?.user) {
            const userData = data.user;
            const tokenData = data.tokens;

            return {
              id: userData.reference,
              reference: userData.reference,
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              image: userData.avatar_url,
              avatar_url: userData.avatar_url,
              avatar: userData.avatar,
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
              phone: userData.phone || "",
              role: userData.account_type,
              account_type: userData.account_type,
              auth_provider: userData.auth_provider,
              status: userData.status,
              locale: userData.locale,
              country: userData.country,
              two_factor_enabled: userData.two_factor_enabled,
              created_at: userData.created_at,
              next_step: data.next_step,
            };
          }

          const errorMessage = "Invalid credentials. Please try again.";
          console.error("[NextAuth Credentials Authorize Failed]:", errorMessage);
          throw new Error(errorMessage);
        } catch (error: unknown) {
          console.error("NextAuth Credentials authorize error:", error);
          if (error instanceof Error) {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const idToken = account.id_token;
        console.log("[NextAuth Google Sign-In] Provider ID token:", idToken);

        try {
          let userAgent: string | undefined;
          try {
            const { headers } = await import("next/headers");
            const reqHeaders = await headers();
            userAgent = reqHeaders.get("user-agent") || undefined;
          } catch {
            // not available
          }
          const responseData = await api.post<VerifyResponse>(API_ROUTES.AUTH.SOCIAL, {
            provider: "google",
            provider_token: idToken,
            userAgent,
          });

          console.log("[BACKEND GOOGLE AUTH RESPONSE]:", JSON.stringify(responseData, null, 2));

          const backendUser = responseData?.user;
          const tokens = responseData?.tokens;

          if (backendUser && tokens) {
            user.id = backendUser.reference || user.id;
            user.reference = backendUser.reference;
            user.email = backendUser.email || user.email;
            user.first_name = backendUser.first_name;
            user.last_name = backendUser.last_name;
            user.image = backendUser.avatar_url;
            user.avatar = backendUser.avatar;
            user.avatar_url = backendUser.avatar_url;
            user.phone = backendUser.phone || "";
            user.name =
              `${backendUser.first_name || ""} ${backendUser.last_name || ""}`.trim() || user.name;
            user.account_type = backendUser.account_type;
            user.role = backendUser.account_type;
            user.access_token = tokens.access_token;
            user.refresh_token = tokens.refresh_token;
            user.next_step = responseData.next_step;
          }

          return true;
        } catch (error) {
          console.error("[NextAuth Google Sign-In] Network error sending token to backend:", error);
          return "/auth/get-started?error=google_auth_failed";
        }
      }

      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.reference = user.reference;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.avatar = user.avatar;
        token.avatar_url = user.avatar_url;
        token.phone = user.phone;
        token.role = user.role;
        token.account_type = user.account_type;
        token.next_step = user.next_step;
      }
      if (account) {
        token.provider = account.provider;
      }

      if (trigger === "update" && session) {
        console.log(session, "updating session");

        if (session.user?.avatar) {
          token.avatar = session.user.avatar;
        }
        if (session.user?.avatar_url) {
          token.avatar_url = session.user.avatar_url;
        }
        if (session.user?.first_name) {
          token.first_name = session.user.first_name;
        }
        if (session.user?.last_name) {
          token.last_name = session.user.last_name;
        }
        if (session.user?.phone) {
          token.phone = session.user.phone;
        }
        if (session.access_token) {
          token.access_token = session.access_token;
        }
        if (session.refresh_token) {
          token.refresh_token = session.refresh_token;
        }
        if (session.next_step !== undefined) {
          token.next_step = session.next_step;
        }
        if (session.user?.next_step !== undefined) {
          token.next_step = session.user.next_step;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.reference = token.reference as string;
        session.access_token = token.access_token as string;
        session.refresh_token = token.refresh_token as string;
        session.next_step = token.next_step as string | null;
        session.user.next_step = token.next_step as string | null;
        session.user.first_name = token.first_name as string;
        session.user.last_name = token.last_name as string;
        session.user.avatar = token.avatar as string;
        session.user.avatar_url = token.avatar_url as string;
        session.user.phone = token.phone as string;

        session.user.role = token.role as string;
        session.user.account_type = token.account_type as AccountType;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.access_token) {
        try {
          await fetch(`${BACKEND_API_URL}${API_ROUTES.AUTH.LOGOUT}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token.access_token}`,
              "Content-Type": "application/json",
            },
          });
          console.log("[NextAuth signOut Event] Backend logout called successfully.");
        } catch (error) {
          console.error("[NextAuth signOut Event] Error calling backend logout:", error);
        }
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/get-started",
    error: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
