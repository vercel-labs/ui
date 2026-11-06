"use client"

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import { ArrowUpRight, X } from "lucide-react"
import type { ReactNode } from "react"
import { frameworks, type Framework } from "@/lib/frameworks"

const docs = "https://ui-sdk.dev/docs"

const docsSlug: Record<Framework, string> = {
  svelte: "svelte",
  vue: "vue",
  react: "react",
  solid: "solid",
  web: "web-components",
}

const link =
  "text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline"

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
      {children}
    </a>
  )
}

const binding: Partial<Record<Framework, string>> = { svelte: "bind:", vue: "v-model" }

function DocsLink({ framework }: { framework: Framework }) {
  return (
    <a
      href={`${docs}/${docsSlug[framework]}`}
      target="_blank"
      rel="noreferrer"
      className={`${link} inline-flex items-center gap-0.5`}
    >
      Docs
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
    </a>
  )
}

function HowToReview({ framework }: { framework: Framework }) {
  const name = frameworks[framework].label

  return (
    <Dialog>
      <DialogTrigger className={link}>How to review</DialogTrigger>
      <DialogBackdrop className="fixed inset-0 z-50 bg-black/20 transition-opacity duration-150 supports-backdrop-filter:backdrop-blur-[2px] data-starting-style:opacity-0 data-ending-style:opacity-0 dark:bg-black/50" />
      <DialogContent className="fixed top-[12vh] left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 flex-col rounded-3xl bg-popover text-sm text-popover-foreground shadow-2xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-150 data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:opacity-0 dark:ring-foreground/10">
        <div className="flex shrink-0 items-center justify-between gap-4 px-6 pt-5 pb-3">
          <DialogTitle className="text-base font-medium">How to review</DialogTitle>
          <DialogClose
            aria-label="Close"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <X aria-hidden="true" className="size-4" />
          </DialogClose>
        </div>
        <div className="flex flex-col gap-4 px-6 pb-6 leading-relaxed">
          <DialogDescription className="text-[15px]">
            An agent built this {name} app with UI SDK and its skills. Read the code and tell us: is this how
            you&apos;d write it?
          </DialogDescription>
          <ol className="flex list-decimal flex-col gap-1.5 ps-5">
            <li>
              Read the <External href={`${docs}/core`}>introduction</External> to learn what UI SDK is.
            </li>
            <li>
              Read <External href={`${docs}/core/build-a-component`}>Build a component</External> to see how
              the adapter works.
            </li>
            <li>
              Use the app on the right and read its code on the left. Inspect takes you from anything in the
              app to its code.
            </li>
          </ol>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-medium">Look for:</h3>
            <ul className="flex list-disc flex-col gap-1 ps-5">
              <li>Code you wouldn&apos;t write in {name}</li>
              <li>State, {binding[framework] ?? "binding"} and events that feel off</li>
              <li>Hydration warnings or state shared across requests</li>
              <li>Types that need a cast</li>
            </ul>
          </div>
          <p>Highlight any code to leave a comment.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { DocsLink, HowToReview }
