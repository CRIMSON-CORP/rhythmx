import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { API_ROUTES } from "@/lib/api-routes";

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
          const res = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              otp: credentials.otp,
            }),
          });

          const data = await res.json().catch(() => ({}));

          if (res.ok && (data?.data?.user || data?.user)) {
            const userData = data?.data?.user || data?.user;
            const tokenData = data?.data?.tokens || data?.tokens || data;

            return {
              id: userData.reference || userData.id || userData._id || "1",
              reference: userData.reference,
              name:
                userData.name ||
                `${userData.first_name || userData.firstName || ""} ${userData.last_name || userData.lastName || ""}`.trim() ||
                credentials.email.split("@")[0],
              email: userData.email || credentials.email,
              image: userData.avatar_url || userData.avatar || userData.image || null,
              accessToken: tokenData.access_token || data.token || data.accessToken || "",
              refreshToken: tokenData.refresh_token,
              firstName: userData.first_name || userData.firstName,
              lastName: userData.last_name || userData.lastName,
              role: userData.account_type || userData.role,
              accountType: userData.account_type || userData.accountType,
            };
          }

          const errorMessage = data?.message || "Invalid credentials. Please try again.";
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
          const res = await fetch(`${BACKEND_API_URL}${API_ROUTES.AUTH.SOCIAL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "google",
              provider_token: idToken,
            }),
          });

          const responseData = await res.json();
          console.log("[BACKEND GOOGLE AUTH RESPONSE]:", JSON.stringify(responseData, null, 2));

          if (res.ok && responseData.status === true && responseData.data) {
            const backendUser = responseData.data.user || responseData.user || {};
            const tokens = responseData.data.tokens || responseData.tokens || {};

            user.id = backendUser.reference || backendUser.id || user.id;
            user.reference = backendUser.reference;
            user.name =
              `${backendUser.first_name || ""} ${backendUser.last_name || ""}`.trim() ||
              backendUser.name ||
              user.name;
            user.email = backendUser.email || user.email;
            user.image = backendUser.avatar_url || backendUser.avatar || user.image;
            user.firstName = backendUser.first_name || backendUser.firstName;
            user.lastName = backendUser.last_name || backendUser.lastName;
            user.accountType = backendUser.account_type || backendUser.accountType;
            user.role = backendUser.account_type || backendUser.role;
            user.accessToken = tokens.access_token || responseData.token;
            user.refreshToken = tokens.refresh_token;
            user.nextStep = responseData.data.next_step;

            return true;
          } else {
            console.error("[NextAuth Google Sign-In] Backend social authentication failed:", responseData);
            return "/auth/get-started?error=google_auth_failed";
          }
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
  secret: process.env.NEXTAUTH_SECRET || "rhythmx_super_secret_key_change_me_in_production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
