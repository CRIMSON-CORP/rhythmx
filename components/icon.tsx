import { cn } from "@/lib/utils";

type SizeProps = {
  size: number;
  width?: never;
  height?: never;
};

type DimensionProps = {
  size?: never;
  width: number;
  height: number;
};

type IconProps = {
  className?: string;
  name: string;
  viewBox?: `${number} ${number} ${number} ${number}`;
} & (SizeProps | DimensionProps);

export default function Icon({ name, size, width, height, className, viewBox }: IconProps) {
  return (
    <svg
      width={size || width}
      height={size || height}
      viewBox={viewBox}
      className={cn("flex-none", className)}
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
}
