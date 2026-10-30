import { cssVariableRows, dataAttributeTables } from "@/lib/data-attributes"
import type { Framework } from "@/lib/frameworks"
import { Frame } from "./frame"

async function DataAttributes({
  framework,
  component = "menu",
}: {
  framework: Framework
  component?: string
}) {
  const { styled, plain } = await dataAttributeTables(component, framework)

  return (
    <div className="my-6 flex flex-col gap-4 text-sm">
      {styled.map((part) => (
        <Frame variant="flat" key={part.slot} className="overflow-hidden">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border/70 px-4 py-2.5">
            {part.name && <span className="font-medium">{part.name}</span>}
            <code className="font-mono text-xs text-subtle">[data-slot="{part.dataSlot}"]</code>
          </div>
          <dl className="divide-y divide-border/60">
            {part.attributes.map(({ attribute, values, text }) => (
              <div key={attribute} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt>
                  <code className="font-mono text-[13px] text-foreground">{attribute}</code>
                </dt>
                <dd className="flex flex-col gap-1.5">
                  {values.length > 0 && (
                    <span className="flex flex-wrap gap-1">
                      {values.map((value) => (
                        <code
                          key={value}
                          className="rounded-md bg-foreground/[0.055] px-1.5 py-0.5 font-mono text-xs"
                        >
                          {value}
                        </code>
                      ))}
                    </span>
                  )}
                  {text && <span className="text-foreground/75">{text}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Frame>
      ))}
      {plain.length > 0 && (
        <p className="text-[15px] leading-[1.65] text-foreground/75">
          {plain.map((part, index) => (
            <span key={part.slot}>
              {index > 0 && ", "}
              <code className="rounded-md bg-foreground/[0.055] px-[0.3em] py-[0.1em] font-mono text-[0.85em] text-foreground">
                {part.name ?? `[data-slot="${part.dataSlot}"]`}
              </code>
            </span>
          ))}{" "}
          have no state attributes. Select them by their{" "}
          <code className="rounded-md bg-foreground/[0.055] px-[0.3em] py-[0.1em] font-mono text-[0.85em] text-foreground">
            data-slot
          </code>
          .
        </p>
      )}
    </div>
  )
}

async function CssVariables({ component = "menu" }: { component?: string }) {
  const rows = await cssVariableRows(component)
  return (
    <Frame variant="flat" className="my-6 overflow-hidden">
      <dl className="divide-y divide-border/60 text-sm">
        {rows.map(({ name, text }) => (
          <div key={name} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt>
              <code className="font-mono text-[13px] text-foreground">{name}</code>
            </dt>
            <dd className="text-foreground/75">{text}</dd>
          </div>
        ))}
      </dl>
    </Frame>
  )
}

export { CssVariables, DataAttributes }
