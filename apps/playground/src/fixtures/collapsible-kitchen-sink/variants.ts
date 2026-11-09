import type { Animation } from "./classes"

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  options?: {
    defaultOpen?: boolean
    disabled?: boolean
    debug?: boolean
  }
  panel?: { keepMounted?: boolean; hiddenUntilFound?: boolean }
  // What the panel holds.
  body?: "text" | "long" | "form" | "grow" | "tree"
  animation?: Animation
  // Where the collapsible sits.
  place?: "card" | "rtl" | "scroll" | "clip" | "transform"
  // The element each part renders, instead of its default.
  render?: { trigger?: "div" | "link"; panel?: "section" }
  controlled?: boolean
  controller?: boolean
  // Cancels opening or closing from onOpenChange.
  cancel?: "open" | "close"
}

const content = {
  trigger: "What's in the box?",
  text: "Three parts, every framework, no styles. A needle hides in this haystack.",
}

// The folders and files of the nested variant. Folders are collapsibles.
type TreeNode = { name: string; children?: TreeNode[] }

const tree: TreeNode = {
  name: "ui-sdk",
  children: [
    {
      name: "packages",
      children: [
        {
          name: "core",
          children: [{ name: "collapsible.ts" }, { name: "disclosure.ts" }],
        },
        {
          name: "react",
          children: [{ name: "collapsible.tsx" }],
        },
      ],
    },
    { name: "tests", children: [{ name: "collapsible.spec.ts" }] },
    { name: "package.json" },
  ],
}

const variants: Variant[] = [
  {
    id: "default",
    section: "Basics",
    title: "Default",
    note: "Closed at first.",
  },
  {
    id: "default-open",
    section: "Basics",
    title: "defaultOpen",
    options: { defaultOpen: true },
  },
  {
    id: "disabled",
    section: "Basics",
    title: "disabled",
    note: "The trigger stays focusable but does nothing.",
    options: { disabled: true },
  },
  {
    id: "disabled-open",
    section: "Basics",
    title: "disabled, open",
    note: "Stays open.",
    options: { disabled: true, defaultOpen: true },
  },

  {
    id: "unmount",
    section: "Mounting",
    title: "Unmounted when closed",
    note: "The default.",
  },
  {
    id: "keep-mounted",
    section: "Mounting",
    title: "keepMounted",
    note: "The closed panel stays in the page, hidden.",
    panel: { keepMounted: true },
  },
  {
    id: "until-found",
    section: "Mounting",
    title: "hiddenUntilFound",
    note: "Press Ctrl+F (⌘F) and search for “haystack”. The match opens this panel.",
    panel: { hiddenUntilFound: true },
  },

  {
    id: "animation-none",
    section: "Animation",
    title: "No animation",
    animation: "none",
  },
  {
    id: "animation-height",
    section: "Animation",
    title: "Height transition",
    animation: "height",
  },
  {
    id: "animation-slow",
    section: "Animation",
    title: "Slow, interrupt it",
    animation: "slow",
  },
  {
    id: "animation-keyframes",
    section: "Animation",
    title: "Keyframes",
    note: "Keyframes read --collapsible-panel-height from data-open and data-closed.",
    animation: "keyframes",
  },
  {
    id: "animation-keyframes-open",
    section: "Animation",
    title: "Keyframes, open at first",
    note: "The open panel must not animate on the first paint.",
    animation: "keyframes",
    options: { defaultOpen: true },
  },
  {
    id: "animation-infinite",
    section: "Animation",
    title: "Infinite exit animation",
    note: "The exit blinks forever. The panel still goes after one iteration.",
    animation: "infinite",
  },
  {
    id: "animation-reduced",
    section: "Animation",
    title: "Reduced motion",
    note: "Turn on reduced motion in your system settings. The panel then opens at once.",
    animation: "reduced",
  },
  {
    id: "animation-fade",
    section: "Animation",
    title: "Fade only",
    animation: "fade",
  },

  {
    id: "controlled",
    section: "Behavior",
    title: "Controlled",
    note: "The buttons below set the open prop.",
    controlled: true,
  },
  {
    id: "controller",
    section: "Behavior",
    title: "Controller",
    note: "createCollapsibleController() drives it from outside.",
    controller: true,
  },
  {
    id: "cancel-open",
    section: "Behavior",
    title: "Cancel opening",
    note: "onOpenChange cancels every opening.",
    cancel: "open",
  },
  {
    id: "cancel-close",
    section: "Behavior",
    title: "Cancel closing",
    note: "onOpenChange cancels every closing.",
    cancel: "close",
    options: { defaultOpen: true },
  },
  {
    id: "complete",
    section: "Behavior",
    title: "onOpenChangeComplete",
    note: "Logs once the slow animation has finished, after openChange.",
    animation: "slow",
  },
  {
    id: "debug",
    section: "Behavior",
    title: "debug",
    note: "Logs every change to the console.",
    options: { debug: true },
  },

  {
    id: "trigger-div",
    section: "Rendering",
    title: "Trigger as a div",
    note: "Gets role=button and tabindex=0. Enter and Space press it.",
    render: { trigger: "div" },
  },
  {
    id: "trigger-link",
    section: "Rendering",
    title: "Trigger as a link",
    note: "Gets role=button and keeps its href.",
    render: { trigger: "link" },
  },
  {
    id: "panel-section",
    section: "Rendering",
    title: "Panel as a section",
    note: "Web components use as-child on the panel.",
    render: { panel: "section" },
  },

  {
    id: "form",
    section: "Content",
    title: "Panel with a field",
    note: "Closing moves focus to the trigger.",
    body: "form",
  },
  { id: "long", section: "Content", title: "Long panel", body: "long" },
  {
    id: "grow",
    section: "Content",
    title: "Content that grows while open",
    note: "Add lines once it's open. The panel follows.",
    body: "grow",
  },
  {
    id: "tree",
    section: "Content",
    title: "Nested collapsibles",
    note: "A file tree.",
    body: "tree",
  },

  { id: "rtl", section: "Containers", title: "Right to left", place: "rtl" },
  {
    id: "scroll",
    section: "Containers",
    title: "Scroll container",
    place: "scroll",
    body: "long",
  },
  {
    id: "clip",
    section: "Containers",
    title: "overflow: hidden",
    note: "The container clips the open panel.",
    place: "clip",
    body: "long",
  },
  {
    id: "transform",
    section: "Containers",
    title: "Scaled container",
    place: "transform",
  },
]

export { content, tree, type TreeNode, type Variant, variants }
