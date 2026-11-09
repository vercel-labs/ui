import { cssVariableTable } from "@/lib/css-variables"
import { dataAttributeTables } from "@/lib/data-attributes"
import type { Framework } from "@/lib/frameworks"
import type { ReactNode } from "react"
import { Frame } from "./frame"
import { Text } from "./type-tables"

const th =
  "border-b border-border/70 px-4 py-2.5 text-start align-bottom text-[13px] font-normal whitespace-nowrap text-subtle"
const td = "border-b border-border/60 px-4 py-2.5 align-top"

function Table({
  columns,
  rows,
}: {
  columns: string[]
  rows: { key: string; cells: ReactNode[] }[]
}) {
  return (
    <Frame variant="flat" className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-start text-[15px] sm:text-sm [&_tr:last-child>td]:border-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className={th}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              {row.cells.map((cell, index) => (
                <td
                  key={index}
                  className={`${td} ${index === 0 ? "whitespace-nowrap" : "text-foreground/75"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  )
}

/** One part's data attributes, under its heading in Data Attributes: its `data-slot`, then a row per attribute. */
async function DataAttributes({
  framework,
  component = "menu",
  part,
}: {
  framework: Framework
  component?: string
  part?: string
}) {
  const { styled } = await dataAttributeTables(component, framework)
  // A page not yet split into a section per part.
  if (!part) {
    return styled.map((each) => (
      <div key={each.slot} className="mt-6">
        <p className="font-medium text-foreground">{each.name}</p>
        <DataAttributes
          framework={framework}
          component={component}
          part={each.slot}
        />
      </div>
    ))
  }
  const found = styled.find((each) => each.slot === part)
  if (!found) {
    return null
  }
  return (
    <>
      <p className="mt-4 text-[15px] text-foreground/75">
        <code className="rounded-md bg-foreground/[0.055] px-[0.3em] py-[0.1em] font-mono text-[0.875em] text-foreground">
          [data-slot="{found.dataSlot}"]
        </code>
      </p>
      <Table
        columns={["Attribute", "What it means"]}
        rows={found.attributes.map(({ attribute, values, text }) => ({
          key: attribute,
          cells: [
            <code key="name" className="font-mono text-[13px] text-foreground">
              {attribute}
            </code>,
            <span key="text" className="flex flex-col gap-1.5">
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
              {text && (
                <span>
                  <Text>{text}</Text>
                </span>
              )}
            </span>,
          ],
        }))}
      />
    </>
  )
}

/** One part's CSS variables, under its heading in Styling. */
function CssVariables({
  framework,
  component = "menu",
  part,
}: {
  framework: Framework
  component?: string
  part: string
}) {
  const found = cssVariableTable(component, framework).find(
    (each) => each.part === part
  )
  if (!found) {
    return null
  }
  return (
    <Table
      columns={["Variable", "What it holds"]}
      rows={found.variables.map(({ name, text }) => ({
        key: name,
        cells: [
          <code key="name" className="font-mono text-[13px] text-foreground">
            {name}
          </code>,
          <Text key="text">{text}</Text>,
        ],
      }))}
    />
  )
}

export { CssVariables, DataAttributes }
