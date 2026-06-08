import { create } from "zustand";

export type WithdrawalView =
  | "select-artist"
  | "enter-amount"
  | "withdrawal-bank"
  | "enter-otp"
  | "tranfer-success";

interface WithdrawalStore {
  view: WithdrawalView;
  setView: (view: WithdrawalView) => void;
  form: {
    selected_artist: null | string | number;
    amount: number;
    withdrawal_account_id: number | string | null;
    otp: string;
  };
  setForm: (form: Partial<WithdrawalStore["form"]>) => void;
  resetState: () => void;
}

const useWithdrawalStore = create<WithdrawalStore>((set) => ({
  view: "select-artist",
  setView: (view) => set({ view }),
  form: {
    selected_artist: null,
    amount: 0,
    withdrawal_account_id: null,
    otp: "",
  },
  setForm: (form) => set((state) => ({ form: { ...state.form, ...form } })),
  resetState: () =>
    set({
      view: "select-artist",
      form: {
        selected_artist: null,
        amount: 0,
        withdrawal_account_id: null,
        otp: "",
      },
    }),
}));

export default useWithdrawalStore;
