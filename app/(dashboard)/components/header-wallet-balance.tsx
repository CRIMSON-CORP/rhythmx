import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

async function HeaderWalletBalance() {
  const data = await api.get<MeResponse>(API_ROUTES.USER.ME);
  return <span>${data?.wallet?.balance ?? "0.00"}</span>;
}

export default HeaderWalletBalance;
