import type { ResizableSize } from "@ui-sdk/core/resizable"

// Every scenario in the resizable kitchen sink. Each framework renders the
// same list into the same shell, so every prop can be tried in every framework.
type PanelSpec = {
  label: string
  id?: string
  defaultSize?: ResizableSize
  minSize?: ResizableSize
  maxSize?: ResizableSize
  collapsible?: boolean
  collapsedSize?: ResizableSize
  // A group inside the panel.
  nested?: GroupSpec
}

type GroupSpec = {
  // Group props that are plain values, so the web components take them as attributes.
  options?: {
    orientation?: "horizontal" | "vertical"
    disabled?: boolean
    step?: number
    largeStep?: number
    autoSaveId?: string
    defaultLayout?: number[]
  }
  panels: PanelSpec[]
  // Handles that are disabled, by their index.
  disabledHandles?: number[]
}

type Variant = {
  id: string
  section: string
  title: string
  group: GroupSpec
  // Where the group sits: right to left, in a transformed ancestor or in a scrolling box.
  place?: "rtl" | "transformed" | "scroll"
  // Controlled by the card, with buttons for preset layouts.
  controlled?: boolean
  // Buttons that drive it through a controller.
  controller?: boolean
  // A third panel the card adds and removes.
  conditional?: boolean
}

const two: PanelSpec[] = [{ label: "One" }, { label: "Two" }]
const sidebar: PanelSpec = {
  label: "Sidebar",
  id: "sidebar",
  defaultSize: 30,
  minSize: 15,
  maxSize: 50,
  collapsible: true,
}

const presets = [
  [25, 75],
  [50, 50],
  [75, 25],
]

const variants: Variant[] = [
  { id: "two", section: "Layout", title: "Two panels", group: { panels: two } },
  {
    id: "three",
    section: "Layout",
    title: "Three panels",
    group: {
      panels: [
        { label: "One", defaultSize: 20 },
        { label: "Two" },
        { label: "Three", defaultSize: 20 },
      ],
    },
  },
  {
    id: "vertical",
    section: "Layout",
    title: "Vertical",
    group: { options: { orientation: "vertical" }, panels: two },
  },
  {
    id: "nested",
    section: "Layout",
    title: "Nested, handles meet",
    group: {
      panels: [
        { label: "Left", defaultSize: 40 },
        {
          label: "Right",
          nested: {
            options: { orientation: "vertical" },
            panels: [{ label: "Top" }, { label: "Bottom" }],
          },
        },
      ],
    },
  },
  {
    id: "many",
    section: "Layout",
    title: "Five panels, cascading",
    group: {
      panels: ["A", "B", "C", "D", "E"].map((label) => ({
        label,
        minSize: 10,
      })),
    },
  },

  {
    id: "min-max",
    section: "Sizes",
    title: "Min and max in percent",
    group: { panels: [sidebar, { label: "Main" }] },
  },
  {
    id: "pixels",
    section: "Sizes",
    title: "Min and max in pixels",
    group: {
      panels: [
        {
          label: "Rail",
          defaultSize: "120px",
          minSize: "80px",
          maxSize: "200px",
        },
        { label: "Main" },
      ],
    },
  },
  {
    id: "rem",
    section: "Sizes",
    title: "Sizes in rem",
    group: {
      panels: [
        { label: "Rail", defaultSize: "8rem", minSize: "5rem" },
        { label: "Main" },
      ],
    },
  },
  {
    id: "collapsed-size",
    section: "Sizes",
    title: "Collapses to an icon rail",
    group: {
      panels: [
        {
          label: "Rail",
          defaultSize: 30,
          minSize: 20,
          collapsible: true,
          collapsedSize: "40px",
        },
        { label: "Main" },
      ],
    },
  },
  {
    id: "collapsible-last",
    section: "Sizes",
    title: "Collapsible last panel",
    group: {
      panels: [
        { label: "Main" },
        { label: "Panel", defaultSize: 30, minSize: 20, collapsible: true },
      ],
    },
  },
  {
    id: "default-layout",
    section: "Sizes",
    title: "defaultLayout",
    group: { options: { defaultLayout: [70, 30] }, panels: two },
  },

  {
    id: "disabled",
    section: "Behavior",
    title: "Disabled group",
    group: { options: { disabled: true }, panels: two },
  },
  {
    id: "disabled-handle",
    section: "Behavior",
    title: "One disabled handle",
    group: {
      panels: [{ label: "One" }, { label: "Two" }, { label: "Three" }],
      disabledHandles: [0],
    },
  },
  {
    id: "steps",
    section: "Behavior",
    title: "Step 5, large step 25",
    group: { options: { step: 5, largeStep: 25 }, panels: two },
  },
  {
    id: "controlled",
    section: "Behavior",
    title: "Controlled",
    group: { panels: two },
    controlled: true,
  },
  {
    id: "controller",
    section: "Behavior",
    title: "Controller",
    group: { panels: [sidebar, { label: "Main" }] },
    controller: true,
  },
  {
    id: "autosave",
    section: "Behavior",
    title: "Saved across reloads",
    group: {
      options: { autoSaveId: "kitchen-sink" },
      panels: [
        { ...sidebar, id: "saved-sidebar" },
        { label: "Main", id: "saved-main" },
      ],
    },
  },
  {
    id: "conditional",
    section: "Behavior",
    title: "A panel that comes and goes",
    group: { panels: two },
    conditional: true,
  },

  {
    id: "rtl",
    section: "Containers",
    title: "Right to left",
    group: { panels: [sidebar, { label: "Main" }] },
    place: "rtl",
  },
  {
    id: "transformed",
    section: "Containers",
    title: "Transformed ancestor",
    group: { panels: two },
    place: "transformed",
  },
  {
    id: "scroll",
    section: "Containers",
    title: "Inside a scrolling box",
    group: { panels: two },
    place: "scroll",
  },
]

export { type GroupSpec, type PanelSpec, presets, type Variant, variants }
