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
