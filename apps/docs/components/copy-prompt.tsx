"use client"

import { Frame } from "@/components/frame"
import { stackLogos } from "@/components/stack-logos"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSavedFramework } from "@/lib/preferences"
import { setupPrompt, stacks } from "@/lib/setup-prompts"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@ui-sdk/react/drawer"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"
import { cn } from "cn"
import { CheckIcon, XIcon } from "lucide-react"
import * as React from "react"

const productionSite = "https://ui-sdk.dev"
const noSubscribe = () => () => {}

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

function useSite() {
  return React.useSyncExternalStore(
    noSubscribe,
    () => location.origin,
    () => productionSite
  )
}

// One selection for every Copy Prompt button on the page, with each
// framework keeping the project picked for it.
let selection = { stackId: "", projects: {} as Record<string, string> }
const listeners = new Set<() => void>()

function select(next: Partial<typeof selection>) {
  selection = { ...selection, ...next }
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function useSelection() {
  const saved = useSavedFramework()
  const current = React.useSyncExternalStore(
    subscribe,
    () => selection,
    () => selection
  )
  const stackId = current.stackId || saved || stacks[0].id
  const stack = stacks.find((item) => item.id === stackId) ?? stacks[0]
  const projectId = current.projects[stack.id] ?? stack.projects[0]?.id
  return { stack, projectId }
}

const ruled = "ring-1 ring-foreground/15 ring-inset dark:ring-foreground/10"

const card = cn(
  ruled,
  "relative flex h-11 cursor-pointer items-center gap-2 px-2.5 text-sm sm:gap-2.5 sm:px-3 transition-colors select-none hover:bg-foreground/[0.03] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#006bff] has-focus-visible:outline-solid"
)

function StackCard({
  value,
  name,
  logoOnPhones = true,
}: {
  value: string
  name: string
  logoOnPhones?: boolean
}) {
  const Logo = stackLogos[value as keyof typeof stackLogos]
  return (
    <label className={card}>
      {Logo && (
        <Logo
          className={cn(
            "size-[18px] shrink-0",
            !logoOnPhones && "max-sm:hidden"
          )}
        />
      )}
      <span className="min-w-0 leading-tight sm:truncate">{name}</span>
      <Radio
        value={value}
        className="ms-auto grid size-4 shrink-0 place-items-center text-background ring-1 ring-foreground/30 outline-none ring-inset data-checked:bg-foreground data-checked:ring-foreground"
      >
        <RadioIndicator>
          <CheckIcon
            aria-hidden="true"
            strokeWidth={1.5}
            className="size-3.5"
          />
        </RadioIndicator>
      </Radio>
    </label>
  )
}

function SectionLabel({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <p
      id={id}
      className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase"
    >
      {children}
    </p>
  )
}

// The Clipboard API only exists in secure contexts, so a phone previewing the
// dev site over the network falls back to copying a selection.
async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement("textarea")
    area.value = text
    area.setAttribute("readonly", "")
    area.className = "fixed -left-[9999px]"
    document.body.append(area)
    area.select()
    const copied = document.execCommand("copy")
    area.remove()
    return copied
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  const timeout = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timeout.current), [])

  async function copy() {
    if (!(await writeClipboard(text))) {
      return
    }
    setCopied(true)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-9 items-center bg-[#006bff] px-4 text-sm font-medium whitespace-nowrap text-white outline-none hover:bg-[#0059d6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006bff] focus-visible:outline-solid"
    >
      <span className="grid justify-items-center">
        <span className={cn("col-start-1 row-start-1", copied && "invisible")}>
          Copy Prompt
        </span>
        <span className={cn("col-start-1 row-start-1", !copied && "invisible")}>
          Copied
        </span>
      </span>
      <span role="status" className="sr-only">
        {copied ? "Copied to your clipboard." : ""}
      </span>
    </button>
  )
}

function CopyPromptForm({
  registry,
  close,
}: {
  registry?: string
  close: React.ReactNode
}) {
  const site = useSite()
  const { stack, projectId } = useSelection()
  const prompt = setupPrompt({ stackId: stack.id, projectId, site, registry })
  const id = React.useId()

  return (
    <div className="flex min-h-0 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <SectionLabel id={`${id}-framework`}>Framework</SectionLabel>
        <RadioGroup
          value={stack.id}
          onValueChange={(next) => next && select({ stackId: next })}
          aria-labelledby={`${id}-framework`}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {stacks.map((item) => (
            <StackCard key={item.id} value={item.id} name={item.name} />
          ))}
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-2">
        <SectionLabel id={`${id}-project`}>Project</SectionLabel>
        {"note" in stack ? (
          <p
            className={cn(
              ruled,
              "flex h-11 items-center px-3 text-sm text-muted-foreground"
            )}
          >
            {stack.note}
          </p>
        ) : (
          <RadioGroup
            key={stack.id}
            value={projectId}
            onValueChange={(next) =>
              next &&
              select({ projects: { ...selection.projects, [stack.id]: next } })
            }
            aria-labelledby={`${id}-project`}
            className="-m-1 flex gap-2 overflow-x-auto p-1 *:min-w-max *:flex-1 *:basis-0"
          >
            {stack.projects.map((project) => (
              <StackCard
                key={project.id}
                value={project.id}
                name={project.name}
                logoOnPhones={false}
              />
            ))}
          </RadioGroup>
        )}
      </div>
      <Frame className="flex min-h-0 flex-col">
        <pre
          tabIndex={0}
          aria-label="Prompt"
          className="h-40 scrollbar-none overflow-auto overscroll-contain px-4 py-3.5 font-mono text-[14px] leading-[1.7] break-words whitespace-pre-wrap outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#006bff] focus-visible:outline-solid sm:h-56 sm:text-[13px]"
        >
          {prompt}
        </pre>
      </Frame>
      <div className="flex justify-end gap-2">
        {close}
        <CopyButton text={prompt} />
      </div>
    </div>
  )
}

const secondaryButton =
  "inline-flex h-9 items-center px-4 text-sm font-medium whitespace-nowrap ring-1 ring-foreground/15 outline-none ring-inset hover:bg-foreground/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006bff] focus-visible:outline-solid dark:ring-foreground/10"

const description =
  "Pick your framework and project, then copy this prompt into your agent."

function CopyPromptDialog({
  open,
  onOpenChange,
  registry,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  registry?: string
}) {
  const wide = useWide()
  if (wide) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          instant
          backdropClassName="hidden"
          className="top-[12vh] max-h-[80vh] max-w-[40rem] gap-5 overflow-y-auto rounded-none p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-lg font-medium tracking-[-0.02em]">
                Copy Prompt
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
            <DialogClose
              aria-label="Close"
              className="hit-area inline-flex size-8 shrink-0 items-center justify-center outline-none hover:bg-foreground/[0.06] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-[#006bff]"
            >
              <XIcon aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </DialogClose>
          </div>
          <CopyPromptForm
            registry={registry}
            close={<DialogClose className={secondaryButton}>Close</DialogClose>}
          />
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerBackdrop className="fixed inset-0" />
      <DrawerContent className="relative mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col gap-4 overflow-y-auto bg-popover p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-popover-foreground ring-1 ring-foreground outline-none">
        <span
          aria-hidden="true"
          className="mx-auto h-1 w-10 shrink-0 bg-foreground/20"
        />
        <div className="flex flex-col gap-1">
          <DrawerTitle className="text-lg font-medium tracking-[-0.02em]">
            Copy Prompt
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            {description}
          </DrawerDescription>
        </div>
        <CopyPromptForm
          registry={registry}
          close={<DrawerClose className={secondaryButton}>Close</DrawerClose>}
        />
      </DrawerContent>
    </Drawer>
  )
}

function CopyPromptButton({
  className,
  registry,
  children,
}: {
  className?: string
  registry?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button
        type="button"
        data-copy-prompt=""
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>
      <CopyPromptDialog
        open={open}
        onOpenChange={setOpen}
        registry={registry}
      />
    </>
  )
}

function HeaderCopyPrompt({
  registry,
  className,
}: {
  registry?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "relative inline-flex h-8 shrink-0 items-center bg-foreground px-3 text-sm font-medium whitespace-nowrap text-background outline-none after:absolute after:-inset-1.5 hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006bff] focus-visible:outline-solid",
          className
        )}
      >
        Quickstart
      </button>
      <CopyPromptDialog
        open={open}
        onOpenChange={setOpen}
        registry={registry}
      />
    </>
  )
}

export { CopyPromptButton, CopyPromptDialog, HeaderCopyPrompt }
