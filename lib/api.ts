import { getSession } from "next-auth/react";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  "https://rhythmx.tushcode.com";

type REST_API_VERBS = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const api = {
  get(url: string) {
    return this.fetch(url, "GET");
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
  delete<T>(url: string) {
    return this.fetch(url, "DELETE") as Promise<T>;
  },
  async fetch(url: string, method: REST_API_VERBS, payload?: Record<string, unknown>) {
    const session = await getSession();
    try {
      const response = await fetch(BACKEND_API_URL + url, {
        headers: {
          "content-type": "application/json",
          ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
        method,
        body: JSON.stringify(payload),
      });
      const data = await this.processRequest(response);
      return data;
    } catch (error) {
      throw error;
    }
  },
  async processRequest(response: Response) {
    if (!response) throw new Error("Network request failed");
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
      throw new Error(data.message);
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
  }): Promise<string> {
    const session = await getSession();
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
            resolve(response.message);
          } else {
            reject(new Error(response.message));
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
      if (session?.accessToken) {
        xhr.setRequestHeader("Authorization", `Bearer ${session.accessToken}`);
      }
      xhr.timeout = 30000;
      xhr.send(formData);
    });
  },
};
