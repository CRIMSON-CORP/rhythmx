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

interface EarningsResponse {
  reference: string;
  currency: string;
  total_earnings: number;
  total_streams: number;
  earnings: Earning[];
}

interface GenresResponse {
  genres: (Genre & {
    sub_genres: Genre[];
  })[];
}

interface LanguagesResponse {
  languages: Language[];
}

interface ContributorRole {
  slug: string;
  name: string;
}

interface ContributorGroup {
  group: string;
  label: string;
  roles: ContributorRole[];
}

interface ContributorsResponse {
  groups: ContributorGroup[];
}

interface PublishingType {
  slug: string;
  name: string;
  requires_publisher: boolean;
}

interface PublishingTypesResponse {
  publishing_types: PublishingType[];
}
