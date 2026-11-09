// The token input every implementation renders. Labels, values and order are
// the contract the specs rely on, so change them here and nowhere else.
//
// Before
// <form "Prompt">
//   Label "Prompt" and the editor, a textbox named "Prompt", with the
//   placeholder "Ask anything". A trigger menu inside it:
//     "@" files: a.ts, b.ts, README.md, inserted as file tokens
//     "/" skills, at the start: search <query>, inserted as a skill token
//   Tokens render as chips with a remove button "×".
//   Send
// </form>
// A plain textarea "Scratch", for copying and pasting through plain text.
// After
// Status "Last action": "<reason>:<value as codec text>" for the last change
// Status "Submitted": the codec text the form or onSubmit sent
const tokenInputFixture = {
  label: "Prompt",
  placeholder: "Ask anything",
  formLabel: "Prompt",
  name: "prompt",
  submit: "Send",
  scratch: "Scratch",
  files: [
    { value: "src/a.ts", label: "a.ts" },
    { value: "src/b.ts", label: "b.ts" },
    { value: "README.md", label: "README.md" },
  ],
  skills: [
    {
      value: "search",
      label: "search",
      arguments: [{ name: "query", hint: "<query>", required: true }],
    },
  ],
}

// The triggers every fixture passes.
function tokenTriggers() {
  return [
    { char: "@", type: "file", items: tokenInputFixture.files },
    {
      char: "/",
      boundary: "start" as const,
      type: "skill",
      items: tokenInputFixture.skills,
    },
  ]
}

// Options a spec can set through the URL: ?value=<codec text> starts with it,
// ?deletion=select|revert, ?shortcut=mod+enter, ?copy=label, ?pending makes
// choosing a file pending for 300ms (?fail rejects it), ?form submits the
// form instead of calling onSubmit, ?other-form gives the input `form="other"`
// for an empty form "Other" after the composer, which records what it submits
// as "other:<codec text>", ?disabled, ?readonly, ?controlled passes the value
// back through state (React and Vue).
function tokenInputOptions() {
  const params = new URLSearchParams(location.search)
  return {
    value: params.get("value") ?? "",
    tokenDeletion: (params.get("deletion") ?? undefined) as
      "whole" | "select" | "revert" | undefined,
    submitShortcut: (params.get("shortcut") ?? undefined) as
      "enter" | "mod+enter" | undefined,
    copy: (params.get("copy") ?? undefined) as "codec" | "label" | undefined,
    pending: params.has("pending"),
    fail: params.has("fail"),
    form: params.has("form") || params.has("other-form"),
    otherForm: params.has("other-form"),
    disabled: params.has("disabled"),
    readOnly: params.has("readonly"),
    controlled: params.has("controlled"),
  }
}

// What choosing a file returns with ?pending: a promise that settles after 300ms
// with the token's label and data.
function pendingSelect({ fail }: { fail: boolean }) {
  return new Promise<{ label: string; data: { loaded: boolean } }>(
    (resolve, reject) =>
      setTimeout(
        () =>
          fail
            ? reject(new Error("Not found"))
            : resolve({ label: "Loaded", data: { loaded: true } }),
        300
      )
  )
}

export { pendingSelect, tokenInputFixture, tokenInputOptions, tokenTriggers }
