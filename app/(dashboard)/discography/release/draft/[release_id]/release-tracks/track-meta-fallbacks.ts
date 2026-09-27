/**
 * Fallback contributor roles and publishing types.
 *
 * NOTE FOR BACKEND INTEGRATION:
 * When the backend `GET /api/meta/contributors` endpoint is fully seeded with these roles
 * and groups, and `GET /api/meta/publishing-types` (or equivalent) is provided,
 * you can remove these fallback constants or replace them with direct API values.
 */

export interface ContributorRoleOption {
  slug: string;
  name: string;
}

// Fallback roles for Key Artists (Artist credits)
export const FALLBACK_KEY_ARTIST_ROLES: ContributorRoleOption[] = [
  { slug: "primary-artist", name: "Primary Artist" },
  { slug: "featuring-artist", name: "Featuring Artist" },
  { slug: "remixer", name: "Remixer" },
  { slug: "with", name: "With" },
];

// Fallback roles for Production & Engineering
export const FALLBACK_PRODUCER_ROLES: ContributorRoleOption[] = [
  { slug: "art-director", name: "Art Director" },
  { slug: "artwork", name: "Artwork" },
  { slug: "producer", name: "Producer" },
  { slug: "mixing-engineer", name: "Mixing Engineer" },
  { slug: "mastering-engineer", name: "Mastering Engineer" },
];

// Fallback roles for Performers & Instruments
export const FALLBACK_PERFORMER_ROLES: ContributorRoleOption[] = [
  { slug: "keyboardist", name: "Keyboardist" },
  { slug: "drummer", name: "Drummer" },
  { slug: "violist", name: "Violist" },
  { slug: "guitarist", name: "Guitarist" },
  { slug: "bassist", name: "Bassist" },
  { slug: "vocalist", name: "Vocalist" },
];

// Fallback roles for Writers & Composers
export const FALLBACK_WRITER_ROLES: ContributorRoleOption[] = [
  { slug: "adaptor", name: "Adaptor" },
  { slug: "arranger", name: "Arranger" },
  { slug: "composer", name: "Composer" },
  { slug: "composer-lyricist", name: "Composer & Lyricist" },
  { slug: "lyricist", name: "Lyricist" },
];

// Fallback publishing types
export const FALLBACK_PUBLISHING_TYPES: Array<{ value: string; label: string }> = [
  { value: "copyright_control", label: "Copyright control (self-published)" },
  { value: "public_domain", label: "Public domain (no publisher)" },
  { value: "published", label: "Published (managed by a publisher)" },
  { value: "composer_lyricist", label: "Composer & Lyricist" },
];
