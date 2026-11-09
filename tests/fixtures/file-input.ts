// The page every FileInput implementation renders. Labels, names and order
// are the contract the specs rely on, so change them here and nowhere else.
//
// Before
// <form "Message" id="message">
//   Field: label "Attachments"
//     FileInput (name attachments, accept image/* and .pdf, multiple, at most
//     3 files of 1 to 1,000 bytes):
//       FileInputDropzone (role group "Attachments drop zone"), with the text "Drop
//       files here", "Release to add" while dragging, and Trigger "Browse
//       files". The Note text area is its paste target.
//       List "Attached files": an item per file with its name and a remove button
//     description "Images or PDFs, up to 1 KB.", error
//   Textarea "Note" (name note)
//   Send (submit), Reset
// </form>
// FileInput (accept image/*, capture user): Trigger "Upload avatar" alone
// FileInput (directory): Trigger "Upload folder"
// With ?page: FileInput with a FileInputDropzone (role group "Drop anywhere", target document)
// After
// Status "Last action", status "Actions" (how many changes so far), status "Submitted"

const fileInputFixture = {
  formLabel: "Message",
  formId: "message",
  field: {
    label: "Attachments",
    description: "Images or PDFs, up to 1 KB.",
    error: "Add at least one file.",
  },
  attachments: {
    name: "attachments",
    accept: "image/*,.pdf",
    maxFiles: 3,
    maxSize: 1000,
    minSize: 1,
  },
  zone: {
    label: "Attachments drop zone",
    text: "Drop files here",
    dragging: "Release to add",
  },
  trigger: { label: "Browse files" },
  list: { label: "Attached files" },
  note: { label: "Note", name: "note" },
  avatar: {
    label: "Upload avatar",
    accept: "image/*",
    capture: "user" as const,
  },
  folder: { label: "Upload folder" },
  page: { label: "Drop anywhere", text: "Drop to attach" },
}

// Options a spec can set through the URL: ?disabled disables the attachments,
// ?single turns off multiple, ?max-files=<n> sets maxFiles, ?page adds the
// page-wide zone, ?cancel cancels changes, ?required requires a file,
// ?unnamed renders the attachments without a name, ?controlled controls them,
// and ?ignore-removals makes that controlled owner ignore remove presses.
function fileInputOptions() {
  const params = new URLSearchParams(location.search)
  const maxFiles = params.get("max-files")
  return {
    disabled: params.has("disabled"),
    multiple: !params.has("single"),
    maxFiles:
      maxFiles === null
        ? fileInputFixture.attachments.maxFiles
        : Number(maxFiles),
    page: params.has("page"),
    cancel: params.has("cancel"),
    required: params.has("required"),
    name: params.has("unnamed") ? undefined : fileInputFixture.attachments.name,
    controlled: params.has("controlled"),
    ignoreRemovals: params.has("ignore-removals"),
  }
}

type Named = { name: string }
type Rejection = { file: Named; reasons: string[] }

// What the "Last action" status shows: `attachments:drop:a.png,-b.pdf|c.txt(file-type)`,
// the added files, then the removed ones with a minus, then the rejected ones
// with their reasons. Each file input reports under its own kind:
// `attachments`, `avatar`, `folder` or `page`.
function describeChange(
  kind: string,
  details: {
    reason: string
    added?: readonly Named[]
    removed?: readonly Named[]
    rejected?: readonly Rejection[]
  }
) {
  const files = [
    ...(details.added ?? []).map((file) => file.name),
    ...(details.removed ?? []).map((file) => `-${file.name}`),
  ]
  const rejected = (details.rejected ?? []).map(
    ({ file, reasons }) => `${file.name}(${reasons.join("+")})`
  )
  return `${kind}:${details.reason}:${files.join(",")}|${rejected.join(",")}`
}

// What a form would submit, with file names for files.
function serializeFiles(form: HTMLFormElement) {
  return [...new FormData(form)]
    .map(
      ([name, value]) =>
        `${name}=${typeof value === "string" ? value : value.name}`
    )
    .join("&")
}

export { describeChange, fileInputFixture, fileInputOptions, serializeFiles }
