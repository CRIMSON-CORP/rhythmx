export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    VERIFY: "/api/auth/email-verification",
    SOCIAL: "/api/auth/social",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  ONBOARDING: {
    PROFILE: "/api/onboarding/profile",
    UPLOAD_AVATAR: "/api/onboarding/profile/avatar",
    ACCOUNT_TYPE: "/api/onboarding/account-type",
    ARTIST_DETAILS: "/api/onboarding/account-type/artist",
    COLLABORATOR_DETAILS: "/api/onboarding/account-type/collaborator",
    LABEL_DETAILS: "/api/onboarding/account-type/label",
    ARTIST_PHOTO: "/api/onboarding/account-type/artist/photo",
    COLLABORATOR_PHOTO: "/api/onboarding/account-type/collaborator/photo",
    LABEL_PHOTO: "/api/onboarding/account-type/label/photo",
    TERMS_AGREEMENT: "/api/onboarding/accept-terms",
  },
  USER: {
    ME: "/api/me",
    LOCALE: "/api/me/locale",
    AVATAR: "/api/me/avatar",
    PUSH_NOTIFICATION_TOKEN: "/api/me/fcm-tokens",
    NOTIFICATION_PREFERENCES: "/api/me/notification-preferences",
    ACCOUNT_DELETION: "/api/me/account-deletion",
    DEVICES: "/api/me/devices",
    DEVICE_SIGN_OUT: "/api/me/devices",
    DEVICE_SIGN_OUTS: "/api/me/device-sign-outs",
  },
  RELEASES: {
    MY: "/api/releases",
    CREATE_DRAFT: "/api/releases/draft",
    UPLOAD_ARTWORK: (reference: string) => `/api/releases/draft/${reference}/artwork`,
    TAKEDOWN: (reference: string) => `/api/releases/${reference}/takedown`,
    EARNINGS: (reference: string) => `/api/releases/${reference}/earnings`,
    DRAFT: (reference: string) => `/api/releases/draft/${reference}`,
    ARTISTS: (reference: string) => `/api/releases/draft/${reference}/artists`,
    TRACKS: {
      LIST: (reference: string) => `/api/releases/draft/${reference}/tracks`,
      ADD: (reference: string) => `/api/releases/draft/${reference}/tracks`,
      GET: (reference: string, trackRef: string) => `/api/releases/${reference}/tracks/${trackRef}`,
      UPDATE: (reference: string, trackRef: string) =>
        `/api/releases/draft/${reference}/tracks/${trackRef}`,
      DELETE: (reference: string, trackRef: string) =>
        `/api/releases/draft/${reference}/tracks/${trackRef}`,
      UPLOAD_LICENSE: (reference: string, trackRef: string) =>
        `/api/releases/draft/${reference}/tracks/${trackRef}/license`,
      REMOVE_LICENSE: (reference: string, trackRef: string) =>
        `/api/releases/draft/${reference}/tracks/${trackRef}/license`,
      CREDITS: (reference: string, trackRef: string) =>
        `/api/releases/draft/${reference}/tracks/${trackRef}/credits`,
      ROYALTY_SPLITS: (reference: string, trackRef: string) =>
        `/api/releases/draft/${reference}/tracks/${trackRef}/royalty-splits`,
    },
    PLATFORMS: (reference: string) => `/api/releases/draft/${reference}/platforms`,
    ROYALTY: (reference: string) => `/api/releases/draft/${reference}/royalty`,
    SUBMIT: (reference: string) => `/api/releases/draft/${reference}/submit`,
    FAST_TRACK: (reference: string) => `/api/releases/draft/${reference}/fast-track`,
  },
  LABEL: {
    ME: "/api/label",
    LOGO: "/api/label/logo",
    ARTISTS: "/api/label/artists",
    ARTIST: (reference: string) => `/api/label/artists/${reference}`,
    INVITE_ARTIST: "/api/label/artists/invite",
    TEAM: "/api/label/team",
    TEAM_MEMBER: (reference: string) => `/api/label/team/${reference}`,
    TEAM_AVATAR: (reference: string) => `/api/label/team/${reference}/avatar`,
    ROLES: "/api/label/roles",
    ROLE: (id: number | string) => `/api/label/roles/${id}`,
    UPDATE_ARTIST_PROFILE: (reference: string) => `/api/label/artists/${reference}/profile`,
    PHOTO: (reference: string) => `/api/label/artists/${reference}/photo`,
  },
  ANALYTICS: {
    OVERVIEW: "/api/analytics/overview",
  },
  NOTFICATIONS: {
    LIST: "/api/notifications",
  },
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
    LIST: "/api/plans",
  },
  SUBSCRIPTION: {
    GET: "/api/subscription",
    START: "/api/subscription/start",
    CANCEL: "/api/subscription/cancellation",
  },
  PAYMENTS: {
    CURRENCIES: "/api/payments/currencies",
    CONVERT: (to: string, plan_id: number | string, billing_cycle: string) =>
      `/api/payments/convert?to=${encodeURIComponent(to)}&plan_id=${encodeURIComponent(plan_id)}&billing_cycle=${encodeURIComponent(billing_cycle)}`,
  },
};
