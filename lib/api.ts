type REST_API_VERBS = "GET" | "POST" | "PUT" | "DELETE";

export const api = {
  get(url: string) {
    return this.fetch(url, "GET");
  },
  post(url: string, payload: Record<string, unknown>) {
    return this.fetch(url, "POST", payload);
  },
  put(url: string, payload: Record<string, unknown>) {
    return this.fetch(url, "PUT", payload);
  },
  delete(url: string) {
    return this.fetch(url, "DELETE");
  },
  async fetch(url: string, method: REST_API_VERBS, payload?: Record<string, unknown>) {
    try {
      const response = await fetch(process.env.BACKEND_API_URL + url, {
        headers: {
          "content-type": "application/json",
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
  async processRequest<T>(response: Response) {
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
    console.log(data);
    if (!data.status) throw new Error(data.message);
    return data.data as T;
  },
  postFormData({
    url,
    formData,
    onUploadProgress = () => {},
  }: {
    url: string;
    formData: FormData;
    onUploadProgress: (uploadProgress: number) => void;
  }): Promise<string> {
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

      xhr.open("POST", url, true);
      xhr.timeout = 30000; // 30 seconds timeout
      xhr.send(formData);
    });
  },
};
