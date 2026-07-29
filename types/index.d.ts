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
