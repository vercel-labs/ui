import { Tabs, TabsList, TabsPanel, TabsStackedPanel, TabsTab } from "@/components/ui/tabs"
import { cn } from "cn"
import type { Framework } from "@/lib/frameworks"
import { readExampleModules } from "@/lib/example-modules"
import { readExampleSources } from "@/lib/example-sources"
import { preloadModule } from "react-dom"
import { CodeBlock } from "./code"
import { ExamplePreview } from "./example-preview"
import { FileIcon } from "lucide-react"
import { TabBar } from "./code-tabs"
import { CopyButton } from "./copy-button"
import { ResetButton } from "./reset-button"
import { StylingNote } from "./styling-note"
import { Frame } from "./frame"

async function ComponentExample({
  name,
  framework,
  caption,
  hideCode = false,
  hideTabs = false,
  compact = false,
  tall = false,
}: {
  name: string
  framework: Framework
  caption?: string
  hideCode?: boolean
  hideTabs?: boolean
  compact?: boolean
  tall?: boolean
}) {
  const [sources, modules] = await Promise.all([
    readExampleSources(name, framework),
    readExampleModules(name, framework),
  ])
  if (!sources) return null
  modules?.preload.forEach((url) => preloadModule(url))

  const preview = (
    <ExamplePreview
      name={name}
      src={modules?.src}
      mount={modules?.mount}
      compact={compact}
      tall={tall}
      log={sources.log}
    />
  )
  const single = sources.files.length === 1
  // Several files show one at a time, so the code panel stays as tall as one file.
  const source = single ? (
    <CodeBlock code={sources.files[0].code} lang={sources.files[0].lang} copy={false} />
  ) : (
    <Tabs defaultValue={sources.files[0].name}>
      <TabBar>
        <TabsList aria-label="Files">
          {sources.files.map((file) => (
            <TabsTab key={file.name} value={file.name} className="font-mono text-xs">
              {file.name}
            </TabsTab>
          ))}
        </TabsList>
      </TabBar>
      {sources.files.map((file) => (
        <TabsPanel key={file.name} value={file.name}>
          <CodeBlock code={file.code} lang={file.lang} copy={false} />
        </TabsPanel>
      ))}
    </Tabs>
  )

  const flat =
    "[&_[data-code-frame]]:my-0 [&_[data-code-frame]]:rounded-none [&_[data-code-frame]]:bg-transparent [&_[data-code-frame]]:shadow-none [&_[data-code-frame]]:ring-0"

  return (
    <figure className="my-8">
      {hideCode || hideTabs ? (
        <Frame className="flex flex-col overflow-hidden">
          {preview}
          {!hideCode && <div className={cn("border-t border-border/60", flat)}>{source}</div>}
        </Frame>
      ) : (
        <Frame>
          <Tabs data-copy-scope="" defaultValue="preview" className="group/example flex flex-col">
            <TabBar>
              <TabsList aria-label="Example">
                <TabsTab value="preview">Preview</TabsTab>
                <TabsTab value="code" data-code-tab="">
                  Code
                </TabsTab>
              </TabsList>
              {single && (
                <span className="ms-auto hidden min-w-0 items-center gap-1.5 truncate font-mono text-xs text-muted-foreground group-has-[[data-code-tab][data-selected]]/example:flex">
                  <FileIcon aria-hidden className="size-3.5 shrink-0" />
                  {sources.files[0].name}
                </span>
              )}
              <ResetButton className="ms-auto group-has-[[data-code-tab][data-selected]]/example:hidden" />
              <CopyButton className="hidden group-has-[[data-code-tab][data-selected]]/example:inline-flex" />
            </TabBar>
            <div className="grid [&>*]:min-w-0 [&>*]:[grid-area:1/1] [&>[data-inactive]]:invisible">
              <TabsStackedPanel
                value="preview"
                keepMounted
                className="relative grid rounded-b-frame outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                {preview}
                <StylingNote
                  packageName={`@ui-sdk/${framework === "web-components" ? "web" : framework}`}
                  className="absolute end-1.5 bottom-1.5"
                />
              </TabsStackedPanel>
              <TabsStackedPanel
                value="code"
                keepMounted
                className={cn("overflow-hidden rounded-b-frame outline-none", flat)}
              >
                {source}
              </TabsStackedPanel>
            </div>
          </Tabs>
        </Frame>
      )}
      {caption && (
        <figcaption className="mt-3 px-1 text-sm leading-relaxed text-balance text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export { ComponentExample }
