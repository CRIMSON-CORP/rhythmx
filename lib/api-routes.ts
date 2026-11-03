export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    EMAIL_VERIFICATION: "/api/auth/email-verification",
    SOCIAL: "/api/auth/social",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  ONBOARDING: {
    INDEX: "/api/onboarding",
    PROFILE: {
      INDEX: "/api/onboarding/profile",
      AVATAR: "/api/onboarding/profile/avatar",
    },
    ACCOUNT_TYPE: {
      INDEX: "/api/onboarding/account-type",
      ARTIST: {
        INDEX: "/api/onboarding/account-type/artist",
        PHOTO: "/api/onboarding/account-type/artist/photo",
      },
      COLLABORATOR: {
        INDEX: "/api/onboarding/account-type/collaborator",
        PHOTO: "/api/onboarding/account-type/collaborator/photo",
      },
      LABEL: {
        INDEX: "/api/onboarding/account-type/label",
        PHOTO: "/api/onboarding/account-type/label/photo",
      },
    },
    ACCEPT_TERMS: "/api/onboarding/accept-terms",
  },
  ME: {
    INDEX: "/api/me",
    LOCALE: "/api/me/locale",
    AVATAR: "/api/me/avatar",
    FCM_TOKENS: "/api/me/fcm-tokens",
    NOTIFICATION_PREFERENCES: "/api/me/notification-preferences",
    ACCOUNT_DELETION: "/api/me/account-deletion",
    DEVICES: {
      INDEX: "/api/me/devices",
      DEVICE: (id: number | string) => `/api/me/devices/${encodeURIComponent(id)}`,
    },
    DEVICE_SIGN_OUTS: "/api/me/device-sign-outs",
  },
  RELEASES: {
    INDEX: "/api/releases",
    RELEASE: (reference: string) => `/api/releases/${encodeURIComponent(reference)}`,
    TAKEDOWN: (reference: string) => `/api/releases/${encodeURIComponent(reference)}/takedown`,
    EARNINGS: (reference: string) => `/api/releases/${encodeURIComponent(reference)}/earnings`,
    DRAFT: {
      INDEX: "/api/releases/draft",
      DRAFT: (reference: string) => `/api/releases/draft/${encodeURIComponent(reference)}`,
      ARTWORK: (reference: string) =>
        `/api/releases/draft/${encodeURIComponent(reference)}/artwork`,
      ARTISTS: (reference: string) =>
        `/api/releases/draft/${encodeURIComponent(reference)}/artists`,
      TRACKS: {
        INDEX: (reference: string) => `/api/releases/draft/${encodeURIComponent(reference)}/tracks`,
        TRACK: (reference: string, trackRef: string) =>
          `/api/releases/draft/${encodeURIComponent(reference)}/tracks/${encodeURIComponent(trackRef)}`,
        LICENSE: (reference: string, trackRef: string) =>
          `/api/releases/draft/${encodeURIComponent(reference)}/tracks/${encodeURIComponent(trackRef)}/license`,
        CREDITS: (reference: string, trackRef: string) =>
          `/api/releases/draft/${encodeURIComponent(reference)}/tracks/${encodeURIComponent(trackRef)}/credits`,
        ROYALTY_SPLITS: (reference: string, trackRef: string) =>
          `/api/releases/draft/${encodeURIComponent(reference)}/tracks/${encodeURIComponent(trackRef)}/royalty-splits`,
      },
      PLATFORMS: (reference: string) =>
        `/api/releases/draft/${encodeURIComponent(reference)}/platforms`,
      ROYALTY: (reference: string) =>
        `/api/releases/draft/${encodeURIComponent(reference)}/royalty`,
      SUBMIT: (reference: string) => `/api/releases/draft/${encodeURIComponent(reference)}/submit`,
      FAST_TRACK: (reference: string) =>
        `/api/releases/draft/${encodeURIComponent(reference)}/fast-track`,
    },
  },
  LABEL: {
    INDEX: "/api/label",
    LOGO: "/api/label/logo",
    ARTISTS: {
      INDEX: "/api/label/artists",
      INVITE: "/api/label/artists/invite",
      ARTIST: (reference: string) => `/api/label/artists/${encodeURIComponent(reference)}`,
      STATS: (reference: string) => `/api/label/artists/${encodeURIComponent(reference)}/stats`,
      RELEASES: (reference: string, query: string = "") =>
        `/api/label/artists/${encodeURIComponent(reference)}/releases${query ? `?${query}` : ""}`,
      PROFILE: (reference: string) => `/api/label/artists/${encodeURIComponent(reference)}/profile`,
      PHOTO: (reference: string) => `/api/label/artists/${encodeURIComponent(reference)}/photo`,
    },
    TEAM: {
      INDEX: "/api/label/team",
      MEMBER: (reference: string) => `/api/label/team/${encodeURIComponent(reference)}`,
      AVATAR: (reference: string) => `/api/label/team/${encodeURIComponent(reference)}/avatar`,
    },
    ROLES: {
      INDEX: "/api/label/roles",
      ROLE: (id: number | string) => `/api/label/roles/${encodeURIComponent(id)}`,
    },
  },
  ANALYTICS: {
    OVERVIEW: (range: string = "30d") =>
      `/api/analytics/overview?range=${encodeURIComponent(range)}`,
    PLATFORMS: (range: string = "30d") =>
      `/api/analytics/platforms?range=${encodeURIComponent(range)}`,
    COUNTRIES: (range: string = "30d") =>
      `/api/analytics/countries?range=${encodeURIComponent(range)}`,
  },
  NOTIFICATIONS: {
    INDEX: "/api/notifications",
    READ_ALL: "/api/notifications/read-all",
    NOTIFICATION: (reference: string) => `/api/notifications/${encodeURIComponent(reference)}`,
    READ: (reference: string) => `/api/notifications/${encodeURIComponent(reference)}/read`,
    ACCEPT: (reference: string) => `/api/notifications/${encodeURIComponent(reference)}/accept`,
    DECLINE: (reference: string) => `/api/notifications/${encodeURIComponent(reference)}/decline`,
  },
  SEARCH: (q: string = "") => `/api/search?q=${encodeURIComponent(q)}`,
  META: {
    COUNTRIES: "/api/meta/countries",
    BANKS: "/api/meta/banks",
    TIMEZONES: "/api/meta/timezones",
    GENRES: "/api/meta/genres",
    LANGUAGES: "/api/meta/languages",
    PLATFORMS: "/api/meta/platforms",
    CONTRIBUTORS: "/api/meta/contributors",
    PUBLISHING_TYPES: "/api/meta/publishing-types",
  },
  ARTIST_LOOKUP: {
    SPOTIFY: (q: string) => `/api/artist-lookup/spotify?q=${encodeURIComponent(q)}`,
    APPLE_MUSIC: (q: string) => `/api/artist-lookup/apple-music?q=${encodeURIComponent(q)}`,
  },
  PLANS: {
    INDEX: "/api/plans",
  },
  SUBSCRIPTION: {
    INDEX: "/api/subscription",
    START: "/api/subscription/start",
    CANCELLATION: "/api/subscription/cancellation",
    MEMBER_INVITATIONS: {
      INDEX: "/api/subscription/member-invitations",
      INVITATION: (inviteId: number | string) =>
        `/api/subscription/member-invitations/${encodeURIComponent(inviteId)}`,
      RESEND: (inviteId: number | string) =>
        `/api/subscription/member-invitations/${encodeURIComponent(inviteId)}/resend`,
    },
    MEMBERS: {
      INDEX: "/api/subscription/members",
      MEMBER: (reference: string) => `/api/subscription/members/${encodeURIComponent(reference)}`,
    },
  },
  PAYMENTS: {
    CURRENCIES: "/api/payments/currencies",
    CONVERT: (to: string, plan_id: number | string, billing_cycle: string) =>
      `/api/payments/convert?to=${encodeURIComponent(to)}&plan_id=${encodeURIComponent(plan_id)}&billing_cycle=${encodeURIComponent(billing_cycle)}`,
    PAYMENT: (reference: string) => `/api/payments/${encodeURIComponent(reference)}`,
    VERIFICATION: (reference: string) =>
      `/api/payments/${encodeURIComponent(reference)}/verification`,
  },
  EARNINGS: {
    INDEX: "/api/earnings",
    OVERVIEW: "/api/earnings/overview",
    TRANSACTIONS: {
      INDEX: (queryString?: string) =>
        `/api/earnings/transactions${queryString ? `?${queryString}` : ""}`,
      TRANSACTION: (reference: string) =>
        `/api/earnings/transactions/${encodeURIComponent(reference)}`,
      REPORT: (reference: string) =>
        `/api/earnings/transactions/${encodeURIComponent(reference)}/report`,
      EXPORT: "/api/earnings/transactions/export",
    },
  },
  WITHDRAWALS: {
    ARTISTS: (queryString?: string) =>
      `/api/withdrawals/artists${queryString ? `?${queryString}` : ""}`,
    ACCOUNTS: {
      INDEX: "/api/withdrawals/accounts",
      RESOLVE: "/api/withdrawals/accounts/resolve",
      ACCOUNT: (id: number | string) => `/api/withdrawals/accounts/${encodeURIComponent(id)}`,
    },
    REQUEST: {
      INDEX: "/api/withdrawals/request",
      REQUEST: (reference: string) => `/api/withdrawals/request/${encodeURIComponent(reference)}`,
    },
    REQUEST_CONFIRM: "/api/withdrawals/request-confirm",
  },
};
