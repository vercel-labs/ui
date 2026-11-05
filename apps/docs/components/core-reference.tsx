import { coreEntries, exportsByLayer, layerTitle, type CoreExport } from "@/lib/core-exports"
import { FrameworkLink } from "./site-preferences"
import { Rows } from "./type-tables"
import { Frame } from "./frame"

/**
 * Every export of `@ui-sdk/core` from one layer folder, with its JSDoc.
 * `layer="other"` lists each layer the reference has no section for, under its own heading.
 */
function CoreExports({ layer }: { layer: string }) {
  const groups = exportsByLayer(layer)
  if (layer !== "other") return <ExportRows label={layerTitle(layer)} entries={groups[0].entries} />
  return groups.map((group) => (
    <section key={group.layer}>
      <h3 className="mt-10 mb-3 text-[15px] leading-snug font-medium text-foreground">
        {layerTitle(group.layer)}
      </h3>
      <ExportRows label={layerTitle(group.layer)} entries={group.entries} />
    </section>
  ))
}

function ExportRows({ label, entries }: { label: string; entries: CoreExport[] }) {
  if (!entries.length) return null
  return (
    <Rows
      label={label}
      rows={entries.map((entry) => ({
        name: entry.signature,
        detail: entry.type ? "type" : undefined,
        status: entry.experimental ? "experimental" : undefined,
        text: entry.text,
        members: entry.members,
      }))}
    />
  )
}

/** Every entry of `@ui-sdk/core` but `internal`, linked to the page that documents it. */
function CoreEntries() {
  return (
    <Frame variant="flat" className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-start text-[15px] sm:text-sm [&_tr:last-child>td]:border-0">
        <thead>
          <tr>
            <th className={th}>Entry</th>
            <th className={th}>Documented on</th>
          </tr>
        </thead>
        <tbody>
          {coreEntries().map(({ entry, page, href, names }) => (
            <tr key={entry}>
              <td className={td}>
                <code className="font-mono text-[13px] text-foreground">{entry}</code>
              </td>
              <td className={td}>
                {page ? (
                  <FrameworkLink
                    href={href!}
                    className="text-foreground underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground"
                  >
                    {page.title}
                  </FrameworkLink>
                ) : (
                  <span className="text-subtle">
                    Its JSDoc:{" "}
                    {names.map((name, index) => (
                      <span key={name}>
                        {index > 0 && ", "}
                        <code className="font-mono text-[13px]">{name}</code>
                      </span>
                    ))}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  )
}

const th =
  "border-b border-border/70 px-4 py-2.5 text-start align-bottom text-[13px] font-normal whitespace-nowrap text-subtle"
const td = "border-b border-border/60 px-4 py-2.5 align-top text-foreground/80"

export { CoreEntries, CoreExports }
