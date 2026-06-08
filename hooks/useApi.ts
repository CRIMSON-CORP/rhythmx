import { use } from "react";

const apiCache = new Map();

function useApi<TData = unknown>(url: string) {
  if (!apiCache.has(url)) {
    const promise = fetch(url).then((res) => res.json());
    apiCache.set(url, promise);
  }

  return use(apiCache.get(url) as Promise<TData>);
}

export default useApi;
