import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import { For } from "solid-js"

const releases = Array.from({ length: 12 }, (_, row) => ({
  version: `v1.${12 - row}.0`,
  cells: [
    "Stable",
    "Downloads 12k",
    "Node 20+",
    "MIT",
    "4.1 MB",
    `2026-0${(row % 9) + 1}-14`,
    "No breaking changes",
  ],
}))

function Example() {
  return (
    <ScrollArea type="auto">
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <table>
            <tbody>
              <For each={releases}>
                {(release) => (
                  <tr>
                    <th>{release.version}</th>
                    <For each={release.cells}>{(cell) => <td>{cell}</td>}</For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollArea>
  )
}

export { Example }
