import { cn } from "cn"

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
  outline:
    "border-border bg-background hover:bg-muted data-open:bg-muted dark:bg-transparent dark:hover:bg-input/30",
  ghost: "hover:bg-muted data-open:bg-muted dark:hover:bg-muted/50",
  destructive:
    "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20",
}

const sizes = {
  default: "h-8 px-3",
  sm: "h-7 px-2.5 text-xs",
  icon: "size-8",
  "icon-sm": "size-7",
}

type ButtonVariants = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

function buttonVariants({ variant = "secondary", size = "default" }: ButtonVariants = {}) {
  return cn(
    "inline-flex shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none [&_svg:not([class*=size-])]:size-4",
    variants[variant],
    sizes[size],
  )
}

export { buttonVariants }
export type { ButtonVariants }
