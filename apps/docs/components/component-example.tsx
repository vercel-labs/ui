import { Tabs, TabsList, TabsPanel, TabsStackedPanel, TabsTab } from "@/components/ui/tabs"
import { cn } from "cn"
import type { Framework } from "@/lib/frameworks"
import { readExampleSources } from "@/lib/example-sources"
import { CodeBlock } from "./code"
import { ExamplePreview } from "./example-preview"
import { FileIcon } from "lucide-react"
import { TabBar } from "./code-tabs"
import { CopyButton } from "./copy-button"
import { ResetButton } from "./reset-button"
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
  const sources = await readExampleSources(name, framework)
  if (!sources) return null

  const preview = (
    <ExamplePreview name={name} framework={framework} compact={compact} tall={tall} log={sources.log} />
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
              <CopyButton className="hidden size-7.5 shrink-0 rounded-[8px] hover:bg-muted group-has-[[data-code-tab][data-selected]]/example:inline-flex" />
            </TabBar>
            <div className="grid [&>*]:[grid-area:1/1] [&>[data-inactive]]:invisible">
              <TabsStackedPanel
                value="preview"
                keepMounted
                className="grid rounded-b-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                {preview}
              </TabsStackedPanel>
              <TabsStackedPanel
                value="code"
                keepMounted
                className={cn("overflow-hidden rounded-b-2xl outline-none", flat)}
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
