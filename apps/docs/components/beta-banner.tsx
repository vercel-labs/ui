function BetaBanner() {
  return (
    <div className="sticky top-0 z-20 flex h-9 items-center justify-center bg-muted px-4 text-center text-xs text-muted-foreground sm:text-sm">
      <p>
        UI SDK is in beta.{" "}
        <a
          href="https://vercel.com/docs/release-phases/public-beta-agreement"
          target="_blank"
          rel="noreferrer"
          className="rounded-sm font-medium text-foreground underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          Learn more
        </a>
        .
      </p>
    </div>
  )
}

export { BetaBanner }
