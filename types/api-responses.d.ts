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
  meta?: {
    range: string;
    from: string;
    to: string;
    tier: string;
    last_synced_at: string;
  };
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

interface LabelDetailsResponse {
  label: {
    reference: string;
    name: string;
    slug: string;
    email: string;
    phone: string;
    region: string;
    website: string;
    logo: string;
    logo_url: string;
    is_verified: boolean;
    wallet_control: string;
    created_at: string;
  };
}

interface LabelArtist {
  reference: string;
  legal_name: string;
  stage_name: string;
  email: string;
  phone: string | null;
  gender?: string | null;
  dob?: string | null;
  country: string;
  country_name: string;
  genre: string;
  bio?: string | null;
  avatar_url: string;
  portrait_url: string;
  spotify_linked?: boolean;
  spotify_url: string | null;
  apple_music_linked?: boolean;
  apple_music_url: string | null;
  is_verified?: boolean;
  status: string;
  joined_at: string;
  registered_at?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface LabelArtistsResponse {
  artists: LabelArtist[];
  meta?: {
    pagination: PaginationMeta;
  };
}

interface LabelArtistDetailResponse {
  artist: LabelArtist;
}

interface InviteArtistSentItem {
  invite_id: number;
  email: string;
}

interface InviteArtistSkippedItem {
  email: string;
  reason: string;
}

interface InviteArtistResponse {
  sent?: InviteArtistSentItem[];
  skipped?: InviteArtistSkippedItem[];
}

interface ArtistInviteItem {
  invite_id: number;
  email: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  can_cancel: boolean;
}

interface ArtistInvitesCounts {
  pending: number;
  accepted: number;
  expired: number;
  revoked: number;
}

interface ArtistInvitesResponse {
  invites: ArtistInviteItem[];
  meta?: {
    counts: ArtistInvitesCounts;
  };
}

interface TeamMemberRole {
  id: number;
  name: string;
}

interface TeamMember {
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  status: string;
  joined_at: string;
  role: TeamMemberRole;
}

interface LabelTeamResponse {
  team: TeamMember[];
  meta?: {
    pagination: PaginationMeta;
  };
}

interface RoleCataloguePermission {
  key: string;
  label: string;
  description: string;
}

interface RoleCatalogueGroup {
  key: string;
  label: string;
  description: string;
  permissions: RoleCataloguePermission[];
}

interface RoleItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  members?: number;
  permissions?: Record<string, boolean>;
  created_at?: string;
}

interface LabelRolesResponse {
  roles: RoleItem[];
  catalogue?: RoleCatalogueGroup[];
}

type CreateTeamMemberPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
};

interface CreateTeamMemberResponse {
  reference?: string;
  member?: TeamMember;
}

interface PlanFeature {
  name: string;
  value: boolean | number | string;
}

interface PlanCyclePrices {
  quarterly: number;
  biannual: number;
  annual: number;
}

interface PlanItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  cycle_prices: PlanCyclePrices;
  royalty_commission: number;
  max_artists: number;
  is_custom: boolean;
  features: PlanFeature[];
}

interface PlansResponse {
  plans: PlanItem[];
}

interface UserSubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  price: number;
  max_artists?: number;
}

interface UserSubscription {
  reference: string;
  status: "active" | "cancelled" | "expired" | "on_hold" | string;
  billing_cycle: "quarterly" | "biannual" | "annual" | string;
  auto_renew: boolean;
  start_at: string;
  end_at: string;
  next_billing_at: string | null;
  cancelled_at: string | null;
  amount_paid: number;
  amount: number;
  currency: string;
  gateway: string;
  plan: UserSubscriptionPlan;
}

interface SubscriptionPaymentHistoryItem {
  plan_id: number;
  plan_name: string;
  action: string;
  amount_paid: number;
  amount: number;
  currency: string;
  created_at: string;
  method?: string;
  status?: string;
}

interface SubscriptionResponse {
  subscription: UserSubscription | null;
  history?: SubscriptionPaymentHistoryItem[];
}

interface StartSubscriptionResponse {
  reference: string;
  payment_link: string;
  amount: number;
  currency: string;
  amount_gbp: number;
  fx_rate?: number;
  gateway: string;
}

interface PaymentCurrencyItem {
  code: string;
  name: string;
  symbol: string;
  channels: string[];
}

interface PaymentCurrenciesResponse {
  default: string;
  currencies: PaymentCurrencyItem[];
}

interface PaymentConvertResponse {
  plan: {
    id: number;
    name: string;
    slug: string;
  };
  billing_cycle: string;
  currency: string;
  subtotal: number;
  processing_fee: number;
  total: number;
}

interface PaymentVerificationResponse {
  payment?: {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    amount_gbp: number;
    gateway?: string;
  };
  subscription?: UserSubscription;
  wizard?: Record<string, unknown>;
}

interface PaymentStatusResponse {
  payment: {
    reference: string;
    status: "pending" | "successful" | "failed" | string;
    amount: number;
    currency: string;
    amount_gbp: number;
  };
  subscription?: UserSubscription;
  wizard?: Record<string, unknown>;
}

interface EarningsBalanceResponse {
  balance: number;
  currency: string;
  pending_withdrawals: {
    count: number;
    total: number;
  };
}

interface PlatformEarning {
  platform: string;
  logo_url: string;
  amount: number;
}

interface RoyaltyEarning {
  track: string;
  isrc: string;
  amount: number;
}

interface EarningsOverviewResponse {
  total_earning: number;
  available_funds: number;
  payment_cleared: number;
  ongoing_earnings: number;
  earnings_to_date: number;
  total_withdrawal: {
    count: number;
    amount: number;
  };
  currency: string;
  earning_history: {
    platforms: PlatformEarning[];
    royalty: RoyaltyEarning[];
  };
}

interface WalletTransaction {
  reference: string;
  type: "credit" | "debit" | string;
  source: string;
  amount: number;
  currency: string;
  balance_before: number;
  balance_after: number;
  created_at: string;
  status?: "paid" | "approved" | "pending" | "on_hold" | "processing" | "canceled" | string;
  transact_by?: {
    name: string;
    avatar_url?: string;
  };
  amount_ngn?: number;
  report?: {
    status: "open" | "resolved" | "dismissed" | string;
    reported_at: string;
  } | null;
}

interface WalletTransactionsResponse {
  transactions: WalletTransaction[];
  meta?: {
    filters: {
      type: string | null;
      source: string | null;
      from: string | null;
      to: string | null;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

interface TransactionDetailsResponse {
  transaction: WalletTransaction;
}

interface WithdrawalAccount {
  id: number;
  account_name: string;
  bank_name: string;
  bank_code: string | null;
  account_number: string;
  routing_number: string | null;
  iban: string | null;
  swift_code: string | null;
  bank_country: string;
  currency: string;
  is_default: boolean;
  is_verified: boolean;
  created_at: string;
}

interface WithdrawalAccountsResponse {
  accounts: WithdrawalAccount[];
}

interface WithdrawalArtistItem {
  reference: string;
  name: string;
  location: string;
  avatar_url: string | null;
  balance: string | number;
}

interface WithdrawalArtistsResponse {
  artists: WithdrawalArtistItem[];
  currency?: string;
  total_balance?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

interface WithdrawalRequestItem {
  reference: string;
  amount: string;
  currency: string;
  status: string;
  bank?: {
    id: number;
    bank_name: string;
    last_four: string;
  };
  otp_expiry?: string;
  expected_payout_date?: string;
  created_at: string;
}

interface WithdrawalRequestResponse {
  withdrawal: WithdrawalRequestItem;
}

interface WithdrawalRequestConfirmResponse {
  withdrawal: WithdrawalRequestItem;
  wallet?: {
    balance: string;
  };
}
