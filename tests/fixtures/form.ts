// The sign-up form every implementation renders for Field, FieldSet, Input and
// Textarea. Labels, names and order are the contract the specs rely on.
//
// Before
// <form "Sign up"> (a native form; its submit handler posts to a fake server,
//   and the page shows the errors it answers with on the fields they name,
//   through each Field's `invalid`)
//   FieldSet "Profile", described "Shown on your public page."
//     Field username: label "Username", input (required, minLength 3), description, error
//     Field bio: label "Bio", textarea (auto-resize), description
//   FieldSet "Contact"
//     Field email: label "Email", input type=email, error
//     Field website: label "Website", input group: "https://" text, input, Clear button "Clear website"
//   Save (submit), Reset
// </form>
// Toggle contact (disables the Contact fieldset)
// After
// Status "Last action", status "Submitted"
const formFixture = {
  formLabel: "Sign up",
  profile: { legend: "Profile", description: "Shown on your public page." },
  username: {
    label: "Username",
    name: "username",
    description: "Letters and numbers, at least 3.",
    // The fake server rejects this one.
    taken: "taken",
    takenError: "That username is taken.",
  },
  bio: { label: "Bio", name: "bio", description: "A few words about you." },
  contact: { legend: "Contact" },
  email: { label: "Email", name: "email", defaultValue: "ada@example.com" },
  website: { label: "Website", name: "website", prefix: "https://", clear: "Clear website" },
  // Errors passed at first render with ?errors, like a server-rendered page after a failed post.
  initialErrors: { email: "This email bounced.", bio: ["Too long.", "No links allowed."] },
}

// Options a spec can set through the URL:
// ?action=sync|reject makes the fake server answer at once or fail (default: a
// Promise that settles after 400ms), ?errors starts with `initialErrors`,
// ?disabled disables the Profile fieldset, ?controlled renders the username
// controlled, ?no-digits cancels username changes that contain a digit.
function formOptions() {
  const params = new URLSearchParams(location.search)
  return {
    action: (params.get("action") ?? "async") as "async" | "sync" | "reject",
    errors: params.has("errors") ? (formFixture.initialErrors as FormErrors) : undefined,
    disabled: params.has("disabled"),
    controlled: params.has("controlled"),
    noDigits: params.has("no-digits"),
    submitShortcut: (params.get("submit-shortcut") ?? undefined) as "enter" | "mod+enter" | undefined,
  }
}

const actionDelay = 400

// Errors by field name, like a server answers with.
type FormErrors = Record<string, string | string[] | undefined>

// The page's count of calls to the fake server, so specs can check that a
// submit never reached it without waiting.
type Counted = typeof globalThis & { formSaves?: number }

// The fake server: rejects the taken username, or records what was saved.
// Returns the errors to show, if any.
function save(data: FormData, action: "async" | "sync" | "reject") {
  const page = globalThis as Counted
  page.formSaves = (page.formSaves ?? 0) + 1
  const errors =
    data.get(formFixture.username.name) === formFixture.username.taken
      ? ({ [formFixture.username.name]: formFixture.username.takenError } as FormErrors)
      : undefined
  if (action === "sync") return errors
  return new Promise<typeof errors>((resolve, reject) =>
    setTimeout(
      () => (action === "reject" ? reject(new Error("Network down")) : resolve(errors)),
      actionDelay,
    ),
  )
}

// What the form submitted, as a query string.
function serializeData(data: FormData) {
  return new URLSearchParams(data as unknown as Record<string, string>).toString()
}

// The server's message for a field, several joined, or "" when it has none.
function messageOf(errors: FormErrors | undefined, name: string) {
  const message = errors?.[name]
  return Array.isArray(message) ? message.join(" ") : (message ?? "")
}

// Whether a field shows as invalid: `true` while the server named it, or left
// to the browser's own validation.
function invalidOf(errors: FormErrors | undefined, name: string) {
  return messageOf(errors, name) ? true : undefined
}

// The errors without a field's, once the person changes it.
function without(errors: FormErrors | undefined, name: string) {
  if (!errors?.[name]) return errors
  const { [name]: _removed, ...rest } = errors
  return rest
}

export {
  actionDelay,
  formFixture,
  type FormErrors,
  formOptions,
  invalidOf,
  messageOf,
  save,
  serializeData,
  without,
}
