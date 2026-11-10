import { cn } from "cn"
import Link from "next/link"

type Island = React.ComponentType<{ className: string }>

const cross =
  "pointer-events-none absolute size-[11px] text-[oklch(0.145_0_0)] dark:text-[oklch(0.985_0_0)] before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current/40 after:absolute after:inset-y-0 after:start-[5px] after:w-px after:bg-current/40"

const tones = {
  white: "[--poster:var(--background)]",
  gray: "[--poster:oklch(0.965_0_0)] dark:[--poster:oklch(0.2_0_0)]",
  ink: "[--background:oklch(0.145_0_0)] [--foreground:oklch(0.985_0_0)] [--muted-foreground:oklch(0.708_0_0)] dark:[--background:oklch(1_0_0)] dark:[--foreground:oklch(0.145_0_0)] dark:[--muted-foreground:oklch(0.54_0_0)] [--poster:var(--background)] border-transparent",
}

const line = "color-mix(in oklab, var(--foreground) 7%, transparent)"
const strong = "color-mix(in oklab, var(--foreground) 13%, transparent)"
const dot = "color-mix(in oklab, var(--foreground) 24%, transparent)"

const patterns: Record<string, React.CSSProperties> = {
  none: {},
  grid: {
    backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
    backgroundSize: "24px 24px",
    backgroundPosition: "-1px -1px",
  },
  blueprint: {
    backgroundImage: `linear-gradient(to right, ${strong} 1px, transparent 1px), linear-gradient(to bottom, ${strong} 1px, transparent 1px), linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
    backgroundSize: "96px 96px, 96px 96px, 12px 12px, 12px 12px",
    backgroundPosition: "-1px -1px",
  },
  dots: {
    backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 1.5px)`,
    backgroundSize: "14px 14px",
    backgroundPosition: "0 7px",
  },
  hatch: {
    backgroundImage: `repeating-linear-gradient(-45deg, ${line} 0 1px, transparent 1px 9px)`,
  },
  rules: {
    backgroundImage: `repeating-linear-gradient(to bottom, ${line} 0 1px, transparent 1px 12px)`,
  },
  columns: {
    backgroundImage: `repeating-linear-gradient(to right, ${line} 0 1px, transparent 1px 32px)`,
  },
  rings: {
    backgroundImage: `repeating-radial-gradient(circle at 100% 100%, ${line} 0 1px, transparent 1px 22px)`,
  },
  crosshatch: {
    backgroundImage: `repeating-linear-gradient(45deg, ${line} 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, ${line} 0 1px, transparent 1px 12px)`,
  },
  plus: {
    backgroundImage: `linear-gradient(to right, transparent 9px, ${strong} 9px 10px, transparent 10px), linear-gradient(to bottom, transparent 9px, ${strong} 9px 10px, transparent 10px)`,
    backgroundSize: "40px 40px, 40px 40px",
  },
  ruler: {
    backgroundImage: `repeating-linear-gradient(to right, ${strong} 0 1px, transparent 1px 48px), repeating-linear-gradient(to right, ${line} 0 1px, transparent 1px 8px)`,
    backgroundSize: "100% 100%, 100% 14px",
    backgroundRepeat: "no-repeat, repeat-x",
  },
  squares: {
    backgroundColor: strong,
    WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200' fill='none' stroke='black'>${Array.from(
        { length: 30 },
        (_, index) =>
          `<rect x='${600 - (index + 1) * 20}.5' y='${600 - (index + 1) * 20}.5' width='${(index + 1) * 40}' height='${(index + 1) * 40}'/>`
      ).join("")}</svg>`
    )}")`,
    WebkitMaskPosition: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "1200px 1200px",
  },
  isometric: {
    backgroundImage: `repeating-linear-gradient(30deg, ${line} 0 1px, transparent 1px 16px), repeating-linear-gradient(150deg, ${line} 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, ${line} 0 1px, transparent 1px 27.7px)`,
  },
  halftone: {
    backgroundImage: `radial-gradient(circle, ${dot} 1.4px, transparent 1.6px)`,
    backgroundSize: "10px 10px",
    WebkitMaskImage: "linear-gradient(to bottom, transparent, black)",
  },
}

function Poster({
  fig,
  title,
  meta,
  head,
  touch,
  tone = "gray",
  pattern = "grid",
  backdrop,
  body = "justify-center",
  island: Island,
  className,
  children,
}: {
  fig?: string
  title?: React.ReactNode
  meta?: { label: string; href?: string }[]
  head?: React.ReactNode
  touch?: React.ReactNode
  tone?: keyof typeof tones
  pattern?: keyof typeof patterns
  backdrop?: React.ReactNode
  body?: string
  island?: Island
  className?: string
  children?: React.ReactNode
}) {
  const bodyClassName = cn("relative flex min-w-0 flex-1 flex-col", body)
  return (
    <section
      id={typeof title === "string" ? slug(title) : undefined}
      className={cn(
        "@container relative scroll-mt-24 flex min-w-0 flex-col gap-10 border-(length:--poster-border) [--poster-border:1px] lg:min-h-[36rem] text-foreground border-foreground/10 bg-(--poster) p-6 sm:p-8 lg:p-10",
        tones[tone],
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[var(--pattern-opacity,1)]"
          style={patterns[pattern]}
        />
        {backdrop}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-(--poster-border)"
      >
        <span className={cn(cross, "-start-[5px] -top-[5px]")} />
        <span className={cn(cross, "-end-[5px] -top-[5px]")} />
        <span className={cn(cross, "-start-[5px] -bottom-[5px]")} />
        <span className={cn(cross, "-end-[5px] -bottom-[5px]")} />
      </div>
      <div className="relative flex items-start justify-between gap-6 font-mono text-[11px] leading-4 tracking-[0.06em] text-foreground uppercase">
        <div className="min-w-0 whitespace-pre-line">
          {touch ? (
            <>
              <span className="pointer-coarse:hidden">{head}</span>
              <span className="hidden pointer-coarse:inline">{touch}</span>
            </>
          ) : (
            head
          )}
        </div>
        {fig && (
          <div className="hidden shrink-0 text-foreground/70 @[26rem]:block">
            {fig}
          </div>
        )}
      </div>
      {Island ? (
        <Island className={bodyClassName} />
      ) : (
        <div className={bodyClassName}>{children}</div>
      )}
      {(title || meta) && (
        <div className="relative flex flex-col gap-4">
          {title && (
            <h2 className="text-[clamp(1.5rem,10cqi,3rem)] font-[450] tracking-[-0.045em] whitespace-nowrap">
              {title}
            </h2>
          )}
          {meta && (
            <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
              {meta.map((entry) =>
                entry.href ? (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {entry.label}
                  </Link>
                ) : (
                  <span key={entry.label}>{entry.label}</span>
                )
              )}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

function slug(text: string) {
  return text.replace(/\.$/, "").toLowerCase().replace(/\W+/g, "-")
}

function Title({
  id,
  children,
  max = 30,
  vertical = false,
  className,
}: {
  id?: string
  children: string
  max?: number
  vertical?: boolean
  className?: string
}) {
  const fit = 100 / (children.length * 0.56)
  return (
    <h2
      id={id}
      className={cn(
        "scroll-mt-24 font-[450] leading-[0.82] tracking-[-0.05em] whitespace-nowrap",
        vertical && "@[20rem]:[writing-mode:vertical-rl]",
        className
      )}
      style={{
        fontSize: `max(min(2.25rem, ${fit.toFixed(2)}cqi), min(${max}cqi, ${fit.toFixed(2)}cqi))`,
      }}
    >
      {children}
    </h2>
  )
}

function Numeral({
  children,
  outline = false,
  className,
}: {
  children: React.ReactNode
  outline?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none block font-[450] leading-[0.74] tracking-[-0.04em] select-none",
        outline
          ? "text-(--poster) [-webkit-text-stroke:2px_var(--foreground)] [paint-order:stroke_fill]"
          : "tabular-nums",
        className
      )}
    >
      {children}
    </span>
  )
}

function ComponentPoster({
  title,
  id,
  name,
  island: Island,
  ...props
}: Omit<
  React.ComponentProps<typeof Poster>,
  "title" | "body" | "backdrop" | "island" | "children"
> & {
  title: string
  id: string
  name: string
  island: Island
}) {
  return (
    <Poster {...props} body="gap-8 sm:gap-10">
      <Island className="flex flex-1 items-center justify-center" />
      <div className="flex flex-col gap-5">
        <Title id={id} max={13} className="-ms-[0.04em]">
          {title}
        </Title>
        <Keys keys={keyboard[name] ?? []} />
      </div>
    </Poster>
  )
}

const keyboard: Record<string, string[]> = {
  calendar: ["←", "→", "↑", "↓", "PgUp", "PgDn"],
  command: ["↑", "↓", "Enter", "Esc"],
  "otp-input": ["←", "→", "Backspace"],
  rating: ["←", "→"],
  "number-input": ["↑", "↓", "Home", "End"],
  switch: ["Space"],
  slider: ["←", "→", "Home", "End"],
  "segmented-control": ["←", "→"],
  "color-picker": ["←", "→", "↑", "↓"],
  tree: ["↑", "↓", "←", "→", "Enter"],
  tabs: ["←", "→", "Home", "End"],
  "token-input": ["@", "/", "Tab", "Backspace"],
  accordion: ["Enter", "Space"],
  resizable: ["←", "→", "Home", "End"],
  toolbar: ["←", "→", "Home", "End"],
}

function Keys({ keys }: { keys: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pointer-coarse:hidden">
      {keys.map((key) => (
        <kbd
          key={key}
          className="inline-flex h-7 min-w-7 items-center justify-center border border-foreground bg-(--poster) px-2 font-mono text-[11px]"
        >
          {key}
        </kbd>
      ))}
    </div>
  )
}

function StartPoster({ fig }: { fig?: string }) {
  return (
    <Poster
      fig={fig}
      head={"THAT'S UI SDK\nNOW BUILD SOMETHING WITH IT"}
      pattern="hatch"
      body="justify-end"
      backdrop={
        <Numeral className="absolute end-[0.04em] top-1/2 hidden -translate-y-1/2 text-[length:36cqi] font-[300] transition-transform duration-300 group-has-[a:hover]/start:translate-x-[0.04em] lg:block">
          →
        </Numeral>
      }
      className="group/start lg:min-h-[28rem]"
    >
      <Link
        href="/docs"
        className="w-fit text-[length:clamp(2.5rem,11cqi,11rem)] leading-[0.82] after:absolute after:inset-0 font-[450] tracking-[-0.06em] whitespace-nowrap underline-offset-[0.08em] outline-none hover:underline focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-[#006bff]"
      >
        Start building.
      </Link>
    </Poster>
  )
}

export { ComponentPoster, Numeral, Poster, StartPoster, Title, slug }
