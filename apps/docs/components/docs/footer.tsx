import { cn } from "cn"

function Credit({ className }: { className?: string }) {
  return (
    <p className={cn("text-[13px] text-subtle", className)}>
      The{" "}
      <a
        href="https://github.com/vercel-labs/ui"
        target="_blank"
        rel="noreferrer"
        className="text-foreground underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground"
      >
        source code
      </a>{" "}
      is available on GitHub.
    </p>
  )
}

function Footer({ className }: { className?: string }) {
  return (
    <footer className={className}>
      <Credit />
    </footer>
  )
}

export { Credit, Footer }
