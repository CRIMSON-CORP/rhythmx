interface VerifyResponse {
  user: {
    reference: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    avatar_url: string;
    phone: string | null;
    account_type: string;
    auth_provider: string;
    status: string;
    locale: string;
    country: string | null;
    two_factor_enabled: boolean;
    created_at: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  next_step: string;
}

interface MeResponse {
  user: User;
  subscription: null;
  wallet: {
    balance: "0.00";
  };
}

interface AnalysisOverViewResponse {
  streams: {
    lifetime: number;
    range: number;
  };
  downloads: {
    lifetime: number;
    range: number;
  };
  artists: {
    lifetime: number;
    range: number;
  };
  releases: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  revenue: {
    total: number;
    currency: string;
  };
  earnings_history: EarningHistory[];
}
