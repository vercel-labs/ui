import type { Animation } from "./classes"

// The async action variants run: a second's wait that fails every other time.
let tries = 0
function flakyAction() {
  tries++
  return new Promise<void>((resolve, reject) =>
    setTimeout(
      () => (tries % 2 ? reject(new Error("Network error")) : resolve()),
      1000
    )
  )
}

// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: string
  title: string
  note?: string
  trigger?: string
  // An alert dialog instead of a dialog.
  alert?: boolean
  options?: {
    modal?: boolean | "trap-focus"
    closeOnOutsidePress?: boolean
    dismissible?: boolean
    persistentElements?: string[]
    debug?: boolean
  }
  content?: {
    initialFocus?: "auto" | "content" | "none" | string
    finalFocus?: "trigger" | "none" | string
    keepMounted?: boolean
  }
  // What the dialog holds.
  body?: "form" | "text" | "long" | "nested" | "dialog-form"
  // False leaves the title out, so the trigger names the dialog.
  titled?: boolean
  // A backdrop part, the content's ::backdrop, or nothing.
  backdrop?: "part" | "pseudo" | "none"
  animation?: Animation
  // Where the dialog is declared.
  place?: "card" | "clip" | "transform" | "rtl" | "table"
  portal?: boolean
  controlled?: boolean
  controller?: boolean
  // Refuses dismissals once the field has changed, and asks in onDismissAttempt.
  guard?: boolean
  // The alert dialog's Delete runs an async action that fails every other time.
  action?: boolean
  // A keyboard shortcut on the trigger, shown by a Shortcut part.
  shortcut?: string
}

const variants: Variant[] = [
  {
    id: "modal",
    section: "Modality",
    title: "modal (default)",
    note: "The page is inert and doesn't scroll.",
  },
  {
    id: "trap-focus",
    section: "Modality",
    title: "trap-focus",
    note: "Tab stays inside. The page still scrolls and takes clicks.",
    options: { modal: "trap-focus" },
    backdrop: "none",
  },
  {
    id: "non-modal",
    section: "Modality",
    title: "modal false",
    note: "Beside the page. Tab leaves it, outside presses don't close it.",
    options: { modal: false },
    backdrop: "none",
  },

  {
    id: "outside-false",
    section: "Dismissal",
    title: "closeOnOutsidePress false",
    note: "The backdrop does nothing. Escape still closes.",
    options: { closeOnOutsidePress: false },
  },
  {
    id: "guard",
    section: "Dismissal",
    title: "Confirm before discarding",
    note: "Type in the field, then press Escape or the backdrop.",
    guard: true,
  },
  {
    id: "dismissible-false",
    section: "Dismissal",
    title: "dismissible false",
    note: "Escape, the backdrop and back do nothing, and each attempt is logged.",
    options: { dismissible: false },
  },
  {
    id: "persistent",
    section: "Dismissal",
    title: "persistentElements",
    note: "The events panel stays usable while the dialog is modal.",
    options: { persistentElements: ["aside"] },
  },
  {
    id: "dialog-form",
    section: "Dismissal",
    title: 'form method="dialog"',
    note: "Each button closes it with its value.",
    body: "dialog-form",
  },

  {
    id: "focus-auto",
    section: "Focus",
    title: "initialFocus auto",
    content: { initialFocus: "auto" },
  },
  {
    id: "focus-content",
    section: "Focus",
    title: "initialFocus content",
    note: "For long content: screen readers start at the top.",
    content: { initialFocus: "content" },
  },
  {
    id: "focus-none",
    section: "Focus",
    title: "initialFocus none",
    content: { initialFocus: "none" },
  },
  {
    id: "focus-selector",
    section: "Focus",
    title: "initialFocus selector",
    content: { initialFocus: "[data-save]" },
  },
  {
    id: "final-none",
    section: "Focus",
    title: "finalFocus none",
    content: { finalFocus: "none" },
  },

  {
    id: "long",
    section: "Content",
    title: "Long content",
    note: "Scrolls inside the dialog.",
    body: "long",
  },
  {
    id: "nested",
    section: "Content",
    title: "Nested dialog",
    note: "data-nested and data-nested-open.",
    body: "nested",
  },
  {
    id: "untitled",
    section: "Content",
    title: "No title",
    note: "Named after its trigger.",
    titled: false,
  },
  {
    id: "pseudo",
    section: "Content",
    title: "::backdrop only",
    note: "Styled with backdrop:, no Backdrop part.",
    backdrop: "pseudo",
  },
  {
    id: "keep-mounted",
    section: "Content",
    title: "keepMounted",
    content: { keepMounted: true },
  },

  {
    id: "alert",
    section: "Alert dialog",
    title: "Alert dialog",
    note: "Starts on Cancel. Outside presses never close it.",
    alert: true,
    trigger: "Delete project",
  },
  {
    id: "alert-action",
    section: "Alert dialog",
    title: "Async action",
    note: "Delete stays pending for a second. Every other try fails and stays open.",
    alert: true,
    action: true,
    trigger: "Delete project",
  },
  {
    id: "alert-controller",
    section: "Alert dialog",
    title: "createConfirm()",
    note: "await confirm() resolves true or false.",
    alert: true,
    controller: true,
    trigger: "Delete project",
  },

  {
    id: "portal",
    section: "Containers",
    title: "container",
    note: "Renders into a container outside the card.",
    portal: true,
  },
  {
    id: "clip",
    section: "Containers",
    title: "Inside overflow hidden",
    note: "The top layer escapes clipping.",
    place: "clip",
  },
  {
    id: "transform",
    section: "Containers",
    title: "Inside a transform",
    place: "transform",
  },
  {
    id: "table",
    section: "Containers",
    title: "Inside a table cell",
    note: "Declared in a table cell, rendered in place.",
    place: "table",
  },
  { id: "rtl", section: "Containers", title: "Right to left", place: "rtl" },

  {
    id: "animation-none",
    section: "Animation",
    title: "No animation",
    animation: "none",
  },
  {
    id: "animation-slow",
    section: "Animation",
    title: "Slow",
    note: "Focus returns as soon as it starts closing.",
    animation: "slow",
  },

  { id: "controlled", section: "State", title: "Controlled", controlled: true },
  {
    id: "shortcut",
    section: "State",
    title: "shortcut",
    note: "The trigger opens with mod+shift+k. A modal pauses the page's shortcuts.",
    shortcut: "mod+shift+k",
    trigger: "Search",
  },
  { id: "controller", section: "State", title: "Controller", controller: true },
  {
    id: "debug",
    section: "State",
    title: "debug",
    note: "Logs changes to the console.",
    options: { debug: true },
  },
]

export { flakyAction, type Variant, variants }
