import { BehaviorDrawing } from "@/components/behavior-drawing"
import { Logo } from "@/components/logo"
import { MobileNav } from "@/components/mobile-nav"
import { Search } from "@/components/search"
import { sectionPages, sectionTree } from "@/lib/section-tree"
import Link from "next/link"

export default function HomePage() {
  const core = sectionTree("core")
  const pages = core ? sectionPages(core) : []

  return (
    <div className="flex flex-1 flex-col">
      <MobileNav />
      <Search pages={pages} />
      <main className="container flex flex-1 flex-col items-center justify-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 py-6 sm:gap-16 sm:py-14 lg:grid-cols-2">
          <div className="mx-auto flex w-full min-w-0 max-w-xl flex-col items-start gap-4 text-lg sm:text-base leading-relaxed tracking-[-0.01em] text-balance text-foreground [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8em] [&_code]:whitespace-nowrap [&_code]:text-foreground">
            <h1 className="font-[450] tracking-tight text-3xl">
              An open source library of behaviors that an agent can use to build components.
            </h1>
            <p className="text-muted-foreground">/wait-what</p>
            <p>
              Say we give an agent a Select component. It can build a Select.{" "}
              <br className="hidden sm:block" /> Makes sense, right?
            </p>
            <p>
              But what if, instead, we gave it the pieces that make up a Select? The popup (
              <code>createPopup</code>), the list (<code>createListbox</code>), and finding an option by
              typing (<code>createTypeahead</code>).
            </p>
            <div className="my-4 w-full lg:hidden">
              <BehaviorDrawing />
            </div>
            <p>
              Now not only can it build a Select but it can build an autocomplete, a combobox or even a new
              component we haven’t thought of yet.
            </p>
            <p className="flex items-center gap-2">
              That’s
              <span className="flex items-center">
                <Logo
                  role="img"
                  aria-hidden={false}
                  aria-label="UI SDK"
                  focusable="false"
                  className="inline-block h-[0.875rem] w-auto"
                />
                .
              </span>
            </p>
            <p>
              We abstracted the complex interactions of user interfaces into reusable behaviors. And we taught
              agents how to build and how to use them.
            </p>
            <p>Available for React, Vue, Svelte, Solid and Web Components.</p>
            <Link
              href="/docs/core"
              className="inline-flex h-8.5 shrink-0 items-center justify-center rounded-full bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Read the Docs
            </Link>
          </div>
          <div className="hidden w-full min-w-0 lg:block">
            <div className="max-w-180">
              <BehaviorDrawing />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
