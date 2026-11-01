import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import { cn } from "cn"
import { preloadModule } from "react-dom"
import type { Framework } from "@/lib/frameworks"
import { exampleModules } from "@/lib/example-modules"
import { readExampleSources } from "@/lib/example-sources"
import { CodeBlock } from "./code"
import { ExamplePreview } from "./example-preview"
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
  for (const href of exampleModules(name, framework)) preloadModule(href, { as: "script" })

  const preview = <ExamplePreview name={name} framework={framework} compact={compact} tall={tall} />
  const source = sources.files.map((file) => (
    <CodeBlock key={file.name} title={file.name} code={file.code} lang={file.lang} />
  ))

  const flat =
    "[&>[data-code-frame]]:my-0 [&>[data-code-frame]]:rounded-none [&>[data-code-frame]]:bg-transparent [&>[data-code-frame]]:shadow-none [&>[data-code-frame]]:ring-0"

  return (
    <figure className="my-8">
      {hideCode || hideTabs ? (
        <Frame className="flex flex-col overflow-hidden">
          {preview}
          {!hideCode && <div className={cn("border-t border-border/60", flat)}>{source}</div>}
        </Frame>
      ) : (
        <Frame>
          <Tabs defaultValue="preview" className="flex flex-col">
            <TabsList aria-label="Example" className="border-b border-border/60 px-4 py-2.5">
              <TabsTab value="preview">Preview</TabsTab>
              <TabsTab value="code">Code</TabsTab>
            </TabsList>
            <TabsPanel
              value="preview"
              keepMounted
              className="rounded-b-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {preview}
            </TabsPanel>
            <TabsPanel value="code" className={cn("outline-none", flat)}>
              {source}
            </TabsPanel>
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
