// Every scenario in the FileInput kitchen sink. Each framework renders the
// same list into the same shell, each inside its own <form> with Submit and
// Reset, so drops, choices, removals, submission and reset can be tried on all.
type Variant = {
  id: string
  section: string
  title: string
  // Props for the FileInput root.
  props: Record<string, unknown>
  // The parts it renders. Every part is optional.
  trigger?: boolean
  dropzone?: boolean | { target: "document" }
  list?: boolean
  // A check of your own: names starting with "x" are rejected as "x-file".
  validate?: boolean
  // The announcement: a custom message, or none.
  announcement?: "custom" | "none"
  // A Field around it, with a label, a description and an error.
  field?: boolean
  // Buttons that drive it through a controller.
  controller?: boolean
  // The value kept in the card's own state.
  controlled?: boolean
  // A second file input with its own zone, inside the first zone.
  nested?: boolean
  // A text area that's the zone's paste target.
  pasteTarget?: boolean
}

const all = { trigger: true, dropzone: true, list: true }

const variants: Variant[] = [
  {
    id: "rules-default",
    section: "Rules",
    title: "Default, several files",
    props: { multiple: true },
    ...all,
  },
  {
    id: "rules-single",
    section: "Rules",
    title: "One file",
    props: {},
    ...all,
  },
  {
    id: "rules-images",
    section: "Rules",
    title: "Images only",
    props: { multiple: true, accept: "image/*" },
    ...all,
  },
  {
    id: "rules-extensions",
    section: "Rules",
    title: "Extensions",
    props: { multiple: true, accept: [".pdf", ".csv"] },
    ...all,
  },
  {
    id: "rules-max-files",
    section: "Rules",
    title: "At most 2 files",
    props: { multiple: true, maxFiles: 2 },
    ...all,
  },
  {
    id: "rules-max-size",
    section: "Rules",
    title: "Up to 1 KB",
    props: { multiple: true, maxSize: 1000 },
    ...all,
  },
  {
    id: "rules-min-size",
    section: "Rules",
    title: "At least 10 bytes",
    props: { multiple: true, minSize: 10 },
    ...all,
  },
  {
    id: "rules-validate",
    section: "Rules",
    title: "Your own check",
    props: { multiple: true },
    ...all,
    validate: true,
  },
  {
    id: "parts-trigger",
    section: "Parts",
    title: "Trigger alone",
    props: {},
    trigger: true,
  },
  {
    id: "parts-trigger-list",
    section: "Parts",
    title: "Trigger and list",
    props: { multiple: true },
    trigger: true,
    list: true,
  },
  {
    id: "parts-zone",
    section: "Parts",
    title: "Zone without a trigger",
    props: { multiple: true },
    dropzone: true,
    list: true,
  },
  {
    id: "parts-page",
    section: "Parts",
    title: "Page-wide zone",
    props: { multiple: true },
    dropzone: { target: "document" },
    list: true,
  },
  {
    id: "parts-paste",
    section: "Parts",
    title: "Paste target",
    props: { multiple: true },
    ...all,
    pasteTarget: true,
  },
  {
    id: "parts-nested",
    section: "Parts",
    title: "Nested file inputs",
    props: { multiple: true },
    ...all,
    nested: true,
  },
  {
    id: "behavior-disabled",
    section: "Behavior",
    title: "Disabled",
    props: { disabled: true },
    ...all,
  },
  {
    id: "behavior-announcement",
    section: "Behavior",
    title: "Custom announcement",
    props: { multiple: true },
    ...all,
    announcement: "custom",
  },
  {
    id: "behavior-silent",
    section: "Behavior",
    title: "No announcement",
    props: { multiple: true },
    ...all,
    announcement: "none",
  },
  {
    id: "behavior-controller",
    section: "Behavior",
    title: "Controller",
    props: { multiple: true },
    ...all,
    controller: true,
  },
  {
    id: "behavior-controlled",
    section: "Behavior",
    title: "Controlled",
    props: { multiple: true },
    ...all,
    controlled: true,
  },
  {
    id: "behavior-directory",
    section: "Behavior",
    title: "Folder",
    props: { directory: true },
    trigger: true,
    list: true,
  },
  {
    id: "behavior-capture",
    section: "Behavior",
    title: "Camera",
    props: { capture: "environment" },
    trigger: true,
  },
  {
    id: "forms-named",
    section: "Forms",
    title: "Named",
    props: { multiple: true, name: "files" },
    ...all,
  },
  {
    id: "forms-field",
    section: "Forms",
    title: "In a field, required",
    props: { multiple: true, name: "files", required: true },
    ...all,
    field: true,
  },
  {
    id: "forms-trigger-field",
    section: "Forms",
    title: "Trigger in a field, required",
    props: { name: "avatar", required: true, accept: "image/*" },
    trigger: true,
    field: true,
  },
]

// A check of your own, for variants that ask for one.
const validateName = (file: { name: string }) =>
  file.name.startsWith("x") ? "x-file" : null

const customAnnouncement = (change: {
  added: readonly unknown[]
  removed: readonly unknown[]
}) => `${change.added.length} added, ${change.removed.length} removed.`

// The announcement option a variant asks for.
const announcementFor = (variant: Variant) =>
  variant.announcement === "custom"
    ? customAnnouncement
    : variant.announcement === "none"
      ? () => null
      : undefined

type Named = { name: string }

// What a card's log shows: the reason, the added and removed names, and the rejected ones with reasons.
function describe(details: {
  reason: string
  added?: readonly Named[]
  removed?: readonly Named[]
  rejected?: readonly { file: Named; reasons: string[] }[]
}) {
  const names = (files: readonly Named[] = []) =>
    files.map((file) => file.name).join(", ")
  const parts = [
    details.added?.length && `added ${names(details.added)}`,
    details.removed?.length && `removed ${names(details.removed)}`,
    details.rejected?.length &&
      `rejected ${details.rejected.map(({ file, reasons }) => `${file.name} (${reasons.join(", ")})`).join(", ")}`,
  ].filter(Boolean)
  return `${details.reason}: ${parts.join("; ") || "nothing"}`
}

const sampleFile = () =>
  new File(["sample"], "sample.txt", { type: "text/plain" })

export {
  announcementFor,
  customAnnouncement,
  describe,
  sampleFile,
  validateName,
  type Variant,
  variants,
}
