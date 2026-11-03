"use client"

import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"

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
              {releases.map((release) => (
                <tr key={release.version}>
                  <th>{release.version}</th>
                  {release.cells.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
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
