import { cacheLife, cacheTag } from "next/cache";
import { api } from "./api";
import { API_ROUTES } from "./api-routes";

export async function getMe() {
  "use cache";
  cacheLife({ revalidate: 300 });
  cacheTag("user");
  const { user } = await api.get<{ user: User }>(API_ROUTES.ME.INDEX);
  return user;
}
