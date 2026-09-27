import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex gap-2.5 shrink-0 items-center justify-center rounded-10 whitespace-nowrap leading-tight transition-all select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/80",
        outline:
          "bg-transparent outline outline-black hover:bg-white aria-expanded:bg-white aria-expanded:text-black dark:outline-white dark:hover:bg-input/50",
        white: "bg-white text-black hover:bg-page-background",
        "white-outline": "bg-white text-black outline outline-black hover:bg-page-background",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        blue: "bg-brand-blue text-white outline-blue hover:brightness-80",
        orange: "bg-brand-orange rounded-full gap-2 text-white outline outline-black",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-[#E52E2E] hover:bg-[#E52E2E]/90 text-white hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
      },
      size: {
        default: "p-4",
        xs: "px-4 py-1.5 gap-1 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "px-5 py-2.5 gap-1 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        xl: "px-6 py-5 gap-2 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-10",
      },
      rounded: {
        default: "rounded-full",
        10: "rounded-10",
        full: "rounded-full",
      },
      width: {
        default: "w-fit",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      width: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  rounded = "default",
  width = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-rounded={rounded}
      data-width={width}
      className={cn(buttonVariants({ variant, size, rounded, width, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
