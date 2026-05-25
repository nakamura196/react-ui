import * as React from "react";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ds-ring)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2 text-base",
  lg: "px-6 py-3 text-base",
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--ds-primary)] text-[var(--ds-primary-fg)] hover:bg-[var(--ds-primary-hover)]",
  secondary:
    "border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-fg)] hover:border-[var(--ds-primary)]",
};

/** variant/size から DS ボタンのクラス文字列を生成（<a>/Link にも流用可）。 */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
): string {
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}
