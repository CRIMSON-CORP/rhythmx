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
