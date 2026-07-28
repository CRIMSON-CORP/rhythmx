import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { API_ROUTES } from "@/lib/api-routes";
import { api } from "@/lib/api";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://rhythmx.tushcode.com";

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
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          const endpoint = credentials.otp ? API_ROUTES.AUTH.VERIFY : API_ROUTES.AUTH.LOGIN;
          const payload = credentials.otp
            ? { email: credentials.email, otp: credentials.otp }
            : { email: credentials.email, password: credentials.password };

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
              avatar: userData.avatar,
              accessToken: tokenData.access_token,
              refreshToken: tokenData.refresh_token,
              firstName: userData.first_name,
              lastName: userData.last_name,
              role: userData.account_type,
              accountType: userData.account_type,
              auth_provider: userData.auth_provider,
              status: userData.status,
              locale: userData.locale,
              country: userData.country,
              two_factor_enabled: userData.two_factor_enabled,
              created_at: userData.created_at,
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
          const responseData = await api.post<VerifyResponse>(API_ROUTES.AUTH.SOCIAL, {
            provider: "google",
            provider_token: idToken,
          });

          console.log("[BACKEND GOOGLE AUTH RESPONSE]:", JSON.stringify(responseData, null, 2));

          const backendUser = responseData?.user;
          const tokens = responseData?.tokens;

          if (backendUser && tokens) {
            user.id = backendUser.reference || user.id;
            user.reference = backendUser.reference;
            user.name =
              `${backendUser.first_name || ""} ${backendUser.last_name || ""}`.trim() || user.name;
            user.email = backendUser.email || user.email;
            user.image = backendUser.avatar_url || user.image;
            user.firstName = backendUser.first_name;
            user.lastName = backendUser.last_name;
            user.accountType = backendUser.account_type;
            user.role = backendUser.account_type;
            user.accessToken = tokens.access_token;
            user.refreshToken = tokens.refresh_token;
            user.nextStep = responseData.next_step;
          }

          if (responseData?.next_step === "profile_setup") {
            return "/auth/create-account";
          }

          return true;
        } catch (error) {
          console.error("[NextAuth Google Sign-In] Network error sending token to backend:", error);
          return "/auth/get-started?error=google_auth_failed";
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.reference = user.reference;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.accountType = user.accountType;
        token.nextStep = user.nextStep;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.reference = token.reference as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.nextStep = token.nextStep as string | null;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string;
        session.user.accountType = token.accountType as string;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.accessToken) {
        try {
          await fetch(`${BACKEND_API_URL}${API_ROUTES.AUTH.LOGOUT}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
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
  secret: process.env.NEXTAUTH_SECRET || "rhythmx_super_secret_key_change_me_in_production",
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/get-started",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
