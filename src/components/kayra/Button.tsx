import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Kayra button. Variants only — components never pass raw colour classes.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap uppercase transition-all duration-500 [transition-timing-function:var(--ease-luxe)] disabled:pointer-events-none disabled:opacity-45 select-none",
  {
    variants: {
      variant: {
        solid: "bg-ink text-on-ink hover:bg-ink-soft",
        outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-on-ink",
        onDark: "bg-on-ink text-ink hover:bg-pearl",
        ghostOnDark:
          "border border-on-ink/25 text-on-ink hover:border-on-ink hover:bg-on-ink hover:text-ink",
        link: "text-ink underline-offset-8 hover:underline decoration-walnut px-0",
      },
      size: {
        sm: "h-9 px-5 text-[0.625rem] tracking-[0.24em]",
        md: "h-12 px-8 text-[0.6875rem] tracking-[0.26em]",
        lg: "h-14 px-10 text-[0.75rem] tracking-[0.28em]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
