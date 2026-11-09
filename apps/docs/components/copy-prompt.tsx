"use client"

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerBackdrop, DrawerContent, DrawerTitle } from "@ui-sdk/react/drawer"
import { cn } from "cn"
import { XIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import * as React from "react"

function useWide() {
  const [wide, setWide] = React.useState(true)
  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 40rem)")
    const update = () => setWide(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return wide
}

function CopyPromptDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const wide = useWide()
  if (wide) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-h-64 rounded-none p-6">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-medium tracking-[-0.02em]">Copy prompt</DialogTitle>
            <DialogClose
              aria-label="Close"
              className="hit-area inline-flex size-8 items-center justify-center outline-none hover:bg-foreground/[0.06] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-[#006bff]"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerBackdrop className="fixed inset-0 bg-black/20 transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0 dark:bg-black/50" />
      <DrawerContent className="relative mx-auto flex min-h-64 w-full max-w-lg flex-col gap-4 bg-popover p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-popover-foreground ring-1 ring-foreground outline-none">
        <span aria-hidden="true" className="mx-auto h-1 w-10 bg-foreground/20" />
        <DrawerTitle className="text-lg font-medium tracking-[-0.02em]">Copy prompt</DrawerTitle>
      </DrawerContent>
    </Drawer>
  )
}

function CopyPromptButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button type="button" data-copy-prompt="" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <CopyPromptDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

function HeaderCopyPrompt() {
  const home = usePathname() === "/"
  const [past, setPast] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    if (!home) return
    const update = () => {
      const rects = [...document.querySelectorAll("main [data-copy-prompt]")].map((target) =>
        target.getBoundingClientRect(),
      )
      const visible = rects.some((rect) => rect.bottom > 86 && rect.top < window.innerHeight)
      setPast(rects.length > 0 && rects[0].bottom < 86 && !visible)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [home])
  const shown = !home || past
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-hidden={shown ? undefined : true}
        tabIndex={shown ? undefined : -1}
        className={cn(
          "inline-flex h-8 items-center bg-[#006bff] px-3 text-sm font-medium whitespace-nowrap text-white outline-none hover:bg-[#0059d6] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-[#006bff]",
          !shown && "invisible",
        )}
      >
        Copy Prompt
      </button>
      <CopyPromptDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export { CopyPromptButton, CopyPromptDialog, HeaderCopyPrompt }
