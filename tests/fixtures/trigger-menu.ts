// The trigger menu every implementation renders. Labels, values and order are
// the contract the specs rely on, so change them here and nowhere else.
//
// Before
// <form "Composer">
//   Label "Message" and its field: a textarea, or an input with ?input
//   "@" people: Alice Smith, Bob Jones, Carol White, Dan Brown (disabled),
//     José García, 山田太郎
//   "/" commands, at the start only: /model <model> <effort?>, /clear,
//     /search <query> (free text), /send (submits)
//   "#" channels, loaded after 100ms (300ms with ?slow): general, random,
//     design, engineering
//   With ?empty, an empty message "No matches". A status part.
//   Send
// </form>
// After
// Status "Last action": "select:<value>:<arguments as key=value,…>"
// Status "Open": "<true|false>:<reason>" for the last open change
// Status "Submitted": the message, once the form submits
const triggerMenuFixture = {
  label: "Message",
  formLabel: "Composer",
  empty: "No matches",
  submit: "Send",
  people: [
    { value: "alice", label: "Alice Smith" },
    { value: "bob", label: "Bob Jones" },
    { value: "carol", label: "Carol White" },
    { value: "dan", label: "Dan Brown", disabled: true },
    { value: "jose", label: "José García" },
    { value: "yamada", label: "山田太郎" },
  ],
  commands: [
    {
      value: "model",
      label: "model",
      arguments: [
        {
          name: "model",
          hint: "<model>",
          required: true,
          items: [
            { value: "opus", label: "opus" },
            { value: "sonnet", label: "sonnet" },
            { value: "haiku", label: "haiku" },
          ],
        },
        {
          name: "effort",
          hint: "<effort>",
          items: [
            { value: "low", label: "low" },
            { value: "medium", label: "medium" },
            { value: "high", label: "high" },
          ],
        },
      ],
    },
    { value: "clear", label: "clear" },
    {
      value: "search",
      label: "search",
      arguments: [{ name: "query", hint: "<query>", required: true }],
    },
    { value: "send", label: "send", after: "submit" as const },
  ],
  channels: ["general", "random", "design", "engineering"],
}

// Channels from a fake server: the ones that start with the query, after a delay.
// Records every query it was asked and whether its signal aborted.
const channelRequests: { query: string; aborted: boolean }[] = []
function loadChannels(query: string, { signal }: { signal: AbortSignal }) {
  const slow = new URLSearchParams(location.search).has("slow")
  const request = { query, aborted: false }
  channelRequests.push(request)
  ;(
    window as unknown as { channelRequests: typeof channelRequests }
  ).channelRequests = channelRequests
  return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
    const timer = setTimeout(
      () =>
        resolve(
          triggerMenuFixture.channels
            .filter((channel) => channel.startsWith(query.toLowerCase()))
            .map((channel) => ({ value: channel, label: channel }))
        ),
      slow ? 300 : 100
    )
    signal.addEventListener("abort", () => {
      request.aborted = true
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}

// The triggers every fixture passes.
function fixtureTriggers() {
  const f = triggerMenuFixture
  return [
    { char: "@", type: "mention", items: f.people },
    {
      char: "/",
      boundary: "start" as const,
      type: "command",
      items: f.commands,
    },
    { char: "#", type: "channel", items: loadChannels },
  ]
}

// How the last action reads: "select:model:model=opus,effort=high".
function selectAction(value: unknown, args: Record<string, string>) {
  const list = Object.entries(args)
    .map(([key, value]) => `${key}=${value}`)
    .join(",")
  return `select:${String(value)}:${list}`
}

// Options a spec can set through the URL: ?input renders an <input>, ?textarea
// renders the SDK's Textarea (React and Vue), ?empty
// renders the empty part, ?auto=false turns off autoHighlight, ?twice renders
// a second menu after the first.
function triggerMenuOptions() {
  const params = new URLSearchParams(location.search)
  return {
    input: params.has("input"),
    textarea: params.has("textarea"),
    empty: params.has("empty"),
    autoHighlight: params.get("auto") !== "false",
    twice: params.has("twice"),
  }
}

export {
  channelRequests,
  fixtureTriggers,
  loadChannels,
  selectAction,
  triggerMenuFixture,
  triggerMenuOptions,
}
