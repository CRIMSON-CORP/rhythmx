type ReleaseCardProps = {
  id: string;
  /**
   * Image source
   */
  imageSrc: string;

  /**
   * Link URL
   */
  href: string;

  /**
   * Title
   */
  title: string;
  type: "single" | "album";
  engagements: number;
  name: string;
  sources: string[];
};

interface AccountFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  labelName: string;
  labelAbout: string;
  fundingDate: string;
  licenseNumber: string;
}

type ReleaseResult = {
  id: string;
  title: string;
  type: string;
  platforms: string;
  image: string;
};

interface Artist {
  id: string;
  name: string;
  location: string;
  image: string;
  balance?: number;
}

interface Team {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface Track {
  id: string;
  track_title: string;
  track_duration: string;
  track_file: File | null;
  track_audio_preview: string | null;
  track_remote_url: string | null;
  is_uploaded: boolean;
  upload_progress: number;
  is_uploading: boolean;
  primary_genre?: string;
  language?: string;
  preview_start_time?: string;
  main_artists?: Artist[];
  featured_artists?: Artist[];
  producer_credits?: Artist[];
  writers?: Artist[];
  lyrics?: string;
  master_rights_owner?: string;
  record_label?: string;
  parental_advisory?: boolean;
  already_online?: boolean;
  licensing_document?: boolean;
  royalty_splits?: { name: string; percentage: number }[];
}

interface ReleaseTrackPerson {
  reference: string;
  stage_name?: string;
  first_name?: string;
  last_name?: string;
  genre?: string;
  is_main_artist: boolean;
  country: string;
  display_name: string;
  spotify_url: string | null;
  apple_music_url: string | null;
  image_url?: string | null;
  avatar_url?: string;
  roles: string[];
  publishing?: string | null;
  official_name: string | null;
  portrait_url?: string | null;
  spotify_linked?: boolean;
  spotify_url?: string | null;
  apple_music_linked?: boolean;
  apple_music_url?: string | null;
}

interface ReleaseTrack {
  reference: string;
  order: number;
  title: string;
  title_confirmed: boolean;
  language: string | null;
  primary_genre: string | null;
  secondary_genre: string | null;
  label: string | null;
  isrc: string | null;
  version: string | null;
  is_explicit: boolean;
  has_advisory: boolean;
  is_online: boolean;
  lyrics: string | null;
  preview_clip: string | null;
  master_owner: string | null;
  has_license: boolean;
  license_url: string | null;
  duration: number | null;
  audio_url: string;
  uploaded_at: string;
  people: ReleaseTrackPerson[];
  people_count: number;
  credits_count: number;
  credits_revision: number;
}

interface Permission {
  id: string;
  name: string;
  enabled: boolean;
}

interface PermissionGroup {
  category: string;
  permissions: Permission[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  teamCount: number;
  permissions: PermissionGroup[];
}

interface User {
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  avatar_url: string;
  account_type: string;
  auth_provider: string;
  status: string;
  locale: string;
  country: string | null;
  two_factor_enabled: boolean;
  created_at: string;
  phone: string | null;
  dial_code: string | null;
  phone_number: string | null;
  gender: string;
  dob: string | null;
  timezone: string | null;
}

interface Device {
  id: number;
  name: string;
  type: string;
  location: string;
  ip: string;
  last_login_at: string;
  first_seen_at: string;
  is_current: boolean;
}

interface EarningHistory {
  platform: string;
  amount: number;
  share: number;
}

interface Notification {
  reference: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  image?: string;
}

interface Country {
  code: string;
  name: string;
  currency: string;
  dial: string;
}

interface Bank {
  code: string;
  name: string;
  slug: string;
  type: string;
  currency: string;
}

interface TimeZone {
  slug: string;
  label: string;
}

type ReleaseType = "single" | "ep" | "album" | "compilation";
type ReleaseStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "distributed"
  | "on_hold"
  | "taken_down";

type DistributionStatus =
  | "not_sent"
  | "processing"
  | "live"
  | "failed"
  | "takedown_requested"
  | "takedown_completed";

interface Release {
  /**
   * @description  the release's ID. Use it for every other call, e.g. /api/releases/{reference}
   */
  reference: string;
  /**
   * @description the release name
   */
  title: string;
  type: ReleaseType;
  status: ReleaseStatus;
  distribution_status: DistributionStatus;
  /**
   * @description  full link to the artwork, or null if they haven't uploaded one. Please handle the null.
   */
  cover_url: string;
  /**
   * @description  text. Sub-genre can be null.
   */
  genre: string;
  /**
   * @description  text. Sub-genre can be null.
   */
  sub_genre: string;
  is_explicit: boolean;
  is_fast_track: boolean;
  /**
   * @description like 2026-08-14. created_at — when they made it.
   */
  release_date: string;
  created_at: string;
  artists: Artist[];
  /**
   * @description Total number of songs on the release
   */
  tracks_total: number;
  /**
   * @description how many stores it was sent to (there are 33 to choose from, so 12 means "sent to 12 stores")
   */
  platforms_total: number;
  /**
   * @description total plays across all its songs, all time. Plays, not money.
   */
  total_streams: number;
  platforms: ReleasePlatform[];
}

interface ArtistRelease {
  /**
   * @description  main or featured
   */
  role: "main" | "featured";
  /**
   * @description the artist's name
   */
  name: string;
  /**
   * @description  a number, or null if the name was typed in rather than picked from their roster
   */
  artist_id: number | null;
  /**
   * @description  the artist's spotify url
   */
  spotify_url: string | null;
  /**
   * @description  the artist's apple music url
   */
  apple_music_url: string | null;
  /**
   * @description  use image_url for the artist photo
   */
  image_url: string | null;
}

interface ReleasePlatform {
  platform_id: number;
  name: string;
  logo_url: string;
  status: "live" | "sent" | "pending" | "failed";
}

interface NotificationPreferences {
  unusual_activity: boolean;
  new_releases: boolean;
  updates_announcements: boolean;
  new_features: boolean;
}

interface ReleaseDetail {
  reference: string;
  title: string;
  type: ReleaseType;
  status: ReleaseStatus;
  distribution_status: string;
  cover_url: string;
  genre: string;
  sub_genre: string;
  is_explicit: boolean;
  is_fast_track: boolean;
  release_date: string;
  created_at: string;
  version: string;
  language: string;
  upc: string;
  release_time: string;
  original_release_date: string;
  copyright_year: string;
  copyright_holder: string;
  updated_at: string;
  all_platform_plays: number;
  artists: Artist[];
  tracks: Track[];
  platforms: ReleasePlatform[];
  links: [];
  status_log: [];
}

interface RoyaltySplit {
  split_type: "owner" | "collaborator";
  amount: number;
  email: string | null;
  recipient_name: string | null;
}

interface Track {
  reference: string;
  order: number;
  title: string;
  duration: number | null;
  isrc: string | null;
  version: string | null;
  is_explicit: boolean;
  audio_url: string;
  royalty_splits: RoyaltySplit[];
}

interface Earning {
  platform: string;
  icon: string;
  type: string;
  track: string;
  amount: number;
}

interface Genre {
  slug: string;
  name: string;
}

interface Language {
  slug: string;
  name: string;
  code: string;
  is_metadata_language: boolean;
}

interface Platform {
  id: number;
  slug: string;
  name: string;
  logo_url: string;
  supports_videos: boolean;
  delivery_lead_days: number;
  takedown_lead_days: number;
}

interface IconProps {
  size?: number | `${number}`;
  color?: string;
  className?: string;
}

interface ConnectedArtist {
  id: string;
  image_url?: string | null;
  latest_release?: string | null;
  name: string;
  url?: string | null;
}
