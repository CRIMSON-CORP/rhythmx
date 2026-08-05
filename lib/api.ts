import { getSession, signOut } from "next-auth/react";
import { API_ROUTES } from "./api-routes";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { goeyToast } from "goey-toast";
import { CONSTANTS } from "./constants";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "https://rhythmx.tushcode.com";

type REST_API_VERBS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function getUserSession() {
  if (typeof window === "undefined") {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
    return await getServerSession(authOptions);
  }
  return await getSession();
}

export const api = {
  get<T>(url: string) {
    return this.fetch(url, "GET") as Promise<T>;
  },
  post<T>(url: string, payload: Record<string, unknown>) {
    return this.fetch(url, "POST", payload) as Promise<T>;
  },
  patch<T>(url: string, payload: Record<string, unknown>) {
    return this.fetch(url, "PATCH", payload) as Promise<T>;
  },
  put<T>(url: string, payload: Record<string, unknown>) {
    return this.fetch(url, "PUT", payload) as Promise<T>;
  },
  delete<T>(url: string, payload?: Record<string, unknown>) {
    return this.fetch(url, "DELETE", payload) as Promise<T>;
  },

  async fetch(url: string, method: REST_API_VERBS, payload?: Record<string, unknown>) {
    const session = await getUserSession();
    const token = session?.access_token;

    const options: RequestInit = {
      method,
      headers: {
        "content-type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...(typeof window !== "undefined" && { userAgent: window.navigator.userAgent }),
    };

    // Fix: Prevent GET requests from having a body
    if (payload && method !== "GET") {
      options.body = JSON.stringify(payload);
    }

    try {
      const response = await fetch(BACKEND_API_URL + url, options);
      // Pass context down so we can retry if needed
      return await this.processRequest(response, url, options);
    } catch (error) {
      if (isRedirectError(error)) throw error;
      throw error;
    }
  },

  async processRequest(response: Response, originalUrl: string, originalOptions: RequestInit) {
    if (!response) throw new Error("Network request failed");

    // Handle Token Expiry
    if (response.status === 401) {
      const session = await getUserSession();
      const refreshResponse = await fetch(BACKEND_API_URL + API_ROUTES.AUTH.REFRESH, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refresh_token: session?.refresh_token }),
      });

      // Refresh failed -> Force Logout
      if (refreshResponse.status === 401) {
        if (typeof window !== "undefined") {
          signOut();
        } else {
          const { redirect } = await import("next/navigation");
          redirect("/api/auth/logout");
        }
        return;
      }

      const refreshPayload = await refreshResponse.json();
      const dataObj = refreshPayload.data;
      const newAccessToken = dataObj.access_token;
      const newRefreshToken = dataObj.refresh_token;

      // Fix: Retry the original request with the new token & sync NextAuth session
      if (newAccessToken) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:update-session", {
              detail: {
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
              },
            }),
          );
        }

        const retryOptions = {
          ...originalOptions,
          headers: {
            ...originalOptions.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        };
        const retryResponse = await fetch(BACKEND_API_URL + originalUrl, retryOptions);
        return this.parseAndValidate(retryResponse);
      }
    }

    return this.parseAndValidate(response);
  },

  async parseAndValidate(response: Response) {
    let data;
    try {
      data = await response.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Invalid response from server");
      }
      throw error;
    }

    if (!data.status) {
      if (data.errors) throw data.errors;
      if (typeof window !== "undefined") {
        goeyToast.error(data.message, { id: CONSTANTS.GLOBAL_ERROR_TOAST_ID });
        throw new Error(data.message);
      }
    }
    return data.data;
  },
  async postFormData({
    url,
    formData,
    onUploadProgress = () => {},
  }: {
    url: string;
    formData: FormData;
    onUploadProgress?: (uploadProgress: number) => void;
  }): Promise<{
    message: string;
    data: Record<string, unknown>;
  }> {
    const session = await getUserSession();
    const xhr = new XMLHttpRequest();

    if (onUploadProgress) {
      xhr.upload.addEventListener("progress", function (e) {
        const percent = (e.loaded / e.total) * 100;
        onUploadProgress(percent);
      });
    }

    return new Promise((resolve, reject) => {
      xhr.addEventListener("load", async function () {
        try {
          const response = JSON.parse(xhr.response);
          if (response.status) {
            resolve({
              message: response.message,
              data: response.data,
            });
          } else {
            reject(response.errors || new Error(response.message));
          }
        } catch (err) {
          reject(err);
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error occurred"));
      });

      xhr.addEventListener("timeout", () => {
        reject(new Error("Request timed out"));
      });

      const targetUrl = url.startsWith("http") ? url : BACKEND_API_URL + url;

      xhr.open("POST", targetUrl, true);
      const token = session?.access_token;
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      xhr.timeout = 30000;
      xhr.send(formData);
    });
  },
};
