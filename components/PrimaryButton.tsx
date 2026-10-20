"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Variant = "gold" | "navy" | "outline" | "danger";
type Size = "xl" | "lg" | "md";

/** Game buttons: solid fills, no shadows; they nudge down when pressed. */
const VARIANTS: Record<Variant, string> = {
  gold: "bg-gold text-navy",
  navy: "bg-navy text-white",
  outline: "border-[3px] border-navy bg-white text-navy",
  danger: "bg-red text-white",
};

const SIZES: Record<Size, string> = {
  xl: "min-h-[6.5rem] px-12 text-[2.25rem] gap-4 rounded-2xl",
  lg: "min-h-[5.5rem] px-10 text-[1.9rem] gap-3 rounded-xl",
  md: "min-h-[4.5rem] px-8 text-[1.55rem] gap-3 rounded-xl",
};

const ICON_SIZES: Record<Size, string> = { xl: "2.5rem", lg: "2.1rem", md: "1.75rem" };

interface PrimaryButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconPosition?: "start" | "end";
  children: React.ReactNode;
}

export function PrimaryButton({
  variant = "gold",
  size = "lg",
  icon: Icon,
  iconPosition = "end",
  className = "",
  children,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const icon = Icon && <Icon size={ICON_SIZES[size]} strokeWidth={2.5} aria-hidden className="shrink-0" />;
  return (
    <motion.button
      type="button"
      disabled={disabled}
      className={[
        "relative inline-flex select-none items-center justify-center font-bold uppercase tracking-wide",
        "transition-[opacity,transform,box-shadow] duration-100 active:translate-y-[0.15rem] disabled:pointer-events-none disabled:opacity-40",
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {iconPosition === "start" && icon}
      <span>{children}</span>
      {iconPosition === "end" && icon}
    </motion.button>
  );
}
