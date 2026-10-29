import { createParts } from "@ui-sdk/web"
import { sortable } from "../sortable"

function arrange(list: HTMLElement, instance: ReturnType<typeof sortable>) {
  const items = new Map<string, Element>()
  for (const child of list.children)
    if (child.localName === "ui-sortable-item") items.set(child.getAttribute("value") ?? "", child)
  let next = items.values().next().value ?? null
  for (const [index, key] of instance.api.reorder.order(instance.get()).entries()) {
    const item = items.get(key)
    if (!item) continue
    if (item === next) next = item.nextElementSibling
    else list.insertBefore(item, next)
    item.querySelector("[data-position]")?.replaceChildren(String(index + 1))
  }
}

createParts(sortable, {
  root: { tag: "ui-sortable", render: (el, instance) => instance.subscribe(() => arrange(el, instance)) },
  item: "ui-sortable-item",
  handle: "ui-sortable-handle",
  instructions: "ui-sortable-instructions",
})

const tracks: Record<string, { title: string; artist: string; length: string }> = {
  t1: { title: "Northern Lights", artist: "Halden", length: "3:42" },
  t2: { title: "Glass Harbor", artist: "Mira Vale", length: "4:05" },
  t3: { title: "Copper Sky", artist: "The Fieldnotes", length: "2:58" },
  t4: { title: "Ash and Ember", artist: "Halden", length: "3:17" },
  t5: { title: "Slow Tide", artist: "Oona Reyes", length: "5:01" },
  t6: { title: "Paper Moons", artist: "Mira Vale", length: "3:33" },
}

const photos: Record<string, { label: string; tone: string }> = {
  p1: { label: "Dunes", tone: "from-amber-300 to-orange-500" },
  p2: { label: "Fjord", tone: "from-sky-300 to-indigo-500" },
  p3: { label: "Meadow", tone: "from-lime-300 to-emerald-500" },
  p4: { label: "Dusk", tone: "from-fuchsia-300 to-purple-600" },
  p5: { label: "Glacier", tone: "from-cyan-200 to-sky-500" },
  p6: { label: "Canyon", tone: "from-orange-300 to-red-600" },
  p7: { label: "Forest", tone: "from-emerald-300 to-green-700" },
  p8: { label: "Harbor", tone: "from-slate-300 to-slate-600" },
  p9: { label: "Lagoon", tone: "from-teal-200 to-cyan-600" },
}

const button = "h-8 rounded-md border border-border px-3 text-sm"
const item =
  "relative outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 data-dragging:opacity-40 data-drag-preview:cursor-grabbing data-drag-preview:shadow-lg data-drag-count:after:absolute data-drag-count:after:-top-2 data-drag-count:after:-right-2 data-drag-count:after:flex data-drag-count:after:size-5 data-drag-count:after:items-center data-drag-count:after:justify-center data-drag-count:after:rounded-full data-drag-count:after:bg-primary data-drag-count:after:text-xs data-drag-count:after:text-primary-foreground data-drag-count:after:content-[attr(data-drag-count)]"

const grip = [4, 8, 12]
  .flatMap((y) => [6, 10].map((x) => `<circle cx="${x}" cy="${y}" r="1.2"></circle>`))
  .join("")

const track = (key: string, index: number) => `
  <ui-sortable-item value="${key}" class="${item} flex items-center gap-3 rounded-lg bg-background px-2 py-1.5 data-selected:bg-accent">
    <ui-sortable-handle class="cursor-grab px-0.5 text-muted-foreground">
      <svg viewBox="0 0 16 16" class="size-4" fill="currentColor">${grip}</svg>
    </ui-sortable-handle>
    <span data-position class="w-4 text-right text-xs text-muted-foreground tabular-nums">${index + 1}</span>
    <span class="flex min-w-0 flex-1 flex-col">
      <span class="truncate font-medium">${tracks[key].title}</span>
      <span class="truncate text-xs text-muted-foreground">${tracks[key].artist}</span>
    </span>
    <span class="text-xs text-muted-foreground tabular-nums">${tracks[key].length}</span>
  </ui-sortable-item>`

const photo = (key: string) => `
  <ui-sortable-item value="${key}" class="${item} flex aspect-square cursor-grab items-end rounded-lg bg-linear-to-br p-1.5 text-xs font-medium text-white ${photos[key].tone} data-selected:ring-2 data-selected:ring-primary data-selected:ring-offset-2 data-selected:ring-offset-background">${photos[key].label}</ui-sortable-item>`

function mount(root: HTMLElement) {
  const order = Object.keys(tracks)
  root.innerHTML = `
    <div class="flex w-full max-w-2xl flex-col gap-6 text-sm sm:flex-row sm:items-start">
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex items-center gap-2">
          <button type="button" class="${button}" data-sort>Sort by title</button>
          <button type="button" class="${button}" data-reverse>Reverse</button>
        </div>
        <ui-sortable value="${order}" aria-label="Playlist" class="flex flex-col gap-1 rounded-xl border border-border p-1">
          ${order.map(track).join("")}
          <ui-sortable-instructions>
            Space picks up the focused track, or every selected track; then Up and Down move them, Space
            drops them and Escape puts them back. Shift with an arrow selects, Control or Command with A
            selects all.
          </ui-sortable-instructions>
        </ui-sortable>
      </div>
      <ui-sortable default-value="${Object.keys(photos)}" orientation="grid" aria-label="Photos" class="grid w-full grid-cols-4 gap-2 sm:w-64 sm:grid-cols-3">
        ${Object.keys(photos).map(photo).join("")}
        <ui-sortable-instructions>
          Space picks up the focused photo, or every selected photo; then the arrows move them, Space
          drops them and Escape puts them back.
        </ui-sortable-instructions>
      </ui-sortable>
    </div>
  `
  const playlist = root.querySelector("ui-sortable")!
  const playlistOrder = () => playlist.getAttribute("value")!.split(",")
  const setPlaylistOrder = (keys: string[]) => playlist.setAttribute("value", keys.join(","))
  playlist.addEventListener("valuechange", (event) =>
    setPlaylistOrder((event as CustomEvent<{ value: string[] }>).detail.value),
  )
  root
    .querySelector("[data-sort]")!
    .addEventListener("click", () =>
      setPlaylistOrder(playlistOrder().sort((a, b) => tracks[a].title.localeCompare(tracks[b].title))),
    )
  root
    .querySelector("[data-reverse]")!
    .addEventListener("click", () => setPlaylistOrder(playlistOrder().reverse()))
}

export { mount }
