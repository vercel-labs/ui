"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "cn"
import { CheckIcon, CopyIcon } from "lucide-react"
import * as React from "react"

function CopyButton({ label, className }: { label?: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const timeout = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timeout.current), [])

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    const scope = event.currentTarget.closest("[data-copy-scope], [data-code-frame]")
    const code = (scope?.querySelector('[role="tabpanel"]:not([hidden]) pre') ?? scope?.querySelector("pre"))
      ?.textContent
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopied(false), 1500)
  }

  if (label) {
    return (
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex h-8 shrink-0 items-center rounded-frame-control bg-foreground/5 px-2.5 text-[13px] text-foreground outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/30",
          className,
        )}
      >
        <span className="grid justify-items-center">
          <span className={cn("col-start-1 row-start-1", copied && "invisible")}>{label}</span>
          <span className={cn("col-start-1 row-start-1", !copied && "invisible")}>Copied</span>
        </span>
      </button>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={copied ? "Copied" : "Copy code"}
        onClick={copy}
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-frame-control text-subtle outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30",
          className,
        )}
      >
        {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
    </Tooltip>
  )
}

export { CopyButton }
