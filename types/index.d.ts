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
