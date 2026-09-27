import { FC } from "react";

const ImageIcon: FC<IconProps> = ({ size = 20, className }) => {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 20 20" className={className}>
      <path
        d="M2.0835 9.99998C2.0835 6.26831 2.0835 4.40165 3.24266 3.24248C4.40183 2.08331 6.26766 2.08331 10.0002 2.08331C13.7318 2.08331 15.5985 2.08331 16.7577 3.24248C17.9168 4.40165 17.9168 6.26748 17.9168 9.99998C17.9168 13.7316 17.9168 15.5983 16.7577 16.7575C15.5985 17.9166 13.7327 17.9166 10.0002 17.9166C6.2685 17.9166 4.40183 17.9166 3.24266 16.7575C2.0835 15.5983 2.0835 13.7325 2.0835 9.99998Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 7.5C14.4404 7.5 15 6.94036 15 6.25C15 5.55964 14.4404 5 13.75 5C13.0596 5 12.5 5.55964 12.5 6.25C12.5 6.94036 13.0596 7.5 13.75 7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 18.3333C12.8167 16.4792 11.6125 14.8183 9.8975 13.6117C8.0475 12.3108 5.72667 11.6225 3.34667 11.6692C3.06333 11.6686 2.78111 11.6775 2.5 11.6958"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8335 15C12.251 13.8941 13.7793 13.3275 15.3218 13.3333C16.2156 13.3368 17.099 13.5246 17.9168 13.885"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ImageIcon;
