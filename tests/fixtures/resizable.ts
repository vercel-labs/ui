// The layout every implementation renders. Ids, labels, sizes and order are
// the contract the specs rely on, so change them here and nowhere else.
//
// Before
// Group "editor", horizontal, 800 by 300 pixels:
//   Panel "Sidebar" (25%, 15 to 40, collapsible)
//   Handle "Resize sidebar"
//   Panel "Main" (at least 30), holding a vertical group "main":
//     Panel "Code" (70%, at least 20)
//     Handle "Resize terminal"
//     Panel "Terminal" (the rest, at least 10, collapsible)
//   Handle "Resize preview"
//   Panel "Preview" (25%, at least 120px)
// Collapse sidebar, Expand sidebar, Resize preview (to 200px): controller buttons
// After
// Status "Last action": the group, its rounded layout and the reason, like "editor:30,45,25:drag"
// Status "Committed": every completed change, the same way
const resizableFixture = {
  editor: {
    id: "editor",
    panels: {
      sidebar: {
        id: "sidebar",
        label: "Sidebar",
        defaultSize: 25,
        minSize: 15,
        maxSize: 40,
        collapsible: true,
      },
      main: { id: "main", label: "Main", minSize: 30 },
      preview: {
        id: "preview",
        label: "Preview",
        defaultSize: 25,
        minSize: "120px" as const,
      },
    },
    handles: ["Resize sidebar", "Resize preview"],
  },
  main: {
    id: "main-area",
    panels: {
      code: { id: "code", label: "Code", defaultSize: 70, minSize: 20 },
      terminal: {
        id: "terminal",
        label: "Terminal",
        minSize: 10,
        collapsible: true,
      },
    },
    handle: "Resize terminal",
  },
  buttons: {
    collapse: "Collapse sidebar",
    expand: "Expand sidebar",
    resize: "Resize preview",
  },
  previewSize: "200px" as const,
}

// Options a spec can set through the URL:
// ?orientation=vertical stacks the editor's panels, ?disabled disables it,
// ?controlled controls its layout, ?ignore controls it without ever passing a
// change back, ?locked disables "Resize sidebar", ?cancel cancels its changes,
// ?autosave=<id> saves it under that id, ?default-layout=<a,b,c> sets where it
// starts, ?step=<n> and ?large-step=<n> set the key steps.
function resizableOptions() {
  const params = new URLSearchParams(location.search)
  const number = (name: string) =>
    params.has(name) ? Number(params.get(name)) : undefined
  return {
    orientation: (params.get("orientation") ?? undefined) as
      "horizontal" | "vertical" | undefined,
    disabled: params.has("disabled"),
    controlled: params.has("controlled") || params.has("ignore"),
    ignore: params.has("ignore"),
    locked: params.has("locked"),
    cancel: params.has("cancel"),
    autoSaveId: params.get("autosave") ?? undefined,
    defaultLayout: params.get("default-layout")?.split(",").map(Number),
    step: number("step"),
    largeStep: number("large-step"),
  }
}

// How specs read a layout: whole percentages joined with commas.
const formatLayout = (group: string, layout: number[], reason: string) =>
  `${group}:${layout.map((size) => Math.round(size)).join(",")}:${reason}`

export { formatLayout, resizableFixture, resizableOptions }
