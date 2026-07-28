export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    VERIFY: "/api/auth/email-verification",
    SOCIAL: "/api/auth/social",
    LOGOUT: "/api/auth/logout",
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
};
