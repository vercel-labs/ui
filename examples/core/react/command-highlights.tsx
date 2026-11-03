import * as React from "react"
import { fuzzyScore, matchRanges, matchSegments } from "@ui-sdk/core/text-match"
import { CommandSearch, CommandSearchCommand, CommandSearchInput, CommandSearchList } from "./command-search"

type Mode = "contains" | "startsWith" | "fuzzy"

const commands = [
  "Git push",
  "Git pull",
  "Go to file",
  "Open settings",
  "Settings",
  "Résumé template",
  "Toggle sidebar",
]

function Highlight({ text, query, mode }: { text: string; query: string; mode: Mode }) {
  return matchSegments(text, matchRanges(text, query, mode)).map((segment, index) =>
    segment.match ? <mark key={index}>{segment.text}</mark> : segment.text,
  )
}

function matches(text: string, query: string, mode: Mode) {
  if (!query.trim()) return true
  return mode === "fuzzy" ? fuzzyScore(text, query) > 0 : matchRanges(text, query, mode).length > 0
}

function Example() {
  const [mode, setMode] = React.useState<Mode>("fuzzy")
  return (
    <CommandSearch>
      {({ query }) => (
        <>
          <div data-slot="row">
            <CommandSearchInput aria-label="Search commands" placeholder="Search" />
            <select aria-label="Match" value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
              <option value="fuzzy">Fuzzy</option>
              <option value="contains">Contains</option>
              <option value="startsWith">Starts with</option>
            </select>
          </div>
          <CommandSearchList>
            {commands
              .filter((command) => matches(command, query, mode))
              .map((command) => (
                <CommandSearchCommand key={command}>
                  <Highlight text={command} query={query} mode={mode} />
                </CommandSearchCommand>
              ))}
          </CommandSearchList>
        </>
      )}
    </CommandSearch>
  )
}

export { Example }
