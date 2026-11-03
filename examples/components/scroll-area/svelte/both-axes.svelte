<script lang="ts">
  import {
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaCorner,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  } from "@ui-sdk/svelte/scroll-area"

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
</script>

<ScrollArea type="auto">
  <ScrollAreaViewport>
    <ScrollAreaContent>
      <table>
        <tbody>
          {#each releases as release (release.version)}
            <tr>
              <th>{release.version}</th>
              {#each release.cells as cell (cell)}
                <td>
                  {cell}
                </td>
              {/each}
            </tr>
          {/each}
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
