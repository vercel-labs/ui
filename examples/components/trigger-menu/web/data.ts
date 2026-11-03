import "@ui-sdk/web/trigger-menu"
import type { TriggerDefinition } from "@ui-sdk/web"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

const commands = [
  {
    value: "model",
    label: "model",
    arguments: [
      { name: "model", hint: "<model>", required: true, items: ["opus", "sonnet", "haiku"] },
      { name: "effort", hint: "[effort]", items: ["low", "medium", "high"], allowCustomValue: false },
    ],
  },
  { value: "search", label: "search", arguments: [{ name: "query", hint: "<query>", required: true }] },
  { value: "clear", label: "clear" },
  { value: "send", label: "send", after: "submit" as const },
]

const channels = ["general", "random", "design", "engineering", "marketing", "support"]

function searchChannels(query: string, { signal }: { signal: AbortSignal }) {
  return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
    const timer = setTimeout(
      () =>
        resolve(
          channels
            .filter((channel) => channel.includes(query.toLowerCase()))
            .map((channel) => ({ value: channel, label: channel })),
        ),
      400,
    )
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}

const triggers: TriggerDefinition[] = [
  { char: "@", items: people },
  { char: "/", boundary: "start", items: commands },
  { char: "#", items: searchChannels },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-trigger-menu>
      <ui-trigger-menu-input>
        <textarea aria-label="Message" placeholder="Type @, / or #"></textarea>
      </ui-trigger-menu-input>
      <template>
        <ui-trigger-menu-content>
          <ui-trigger-menu-list>
            <ui-trigger-menu-group>
              <ui-trigger-menu-group-label></ui-trigger-menu-group-label>
              <ui-trigger-menu-item>
              </ui-trigger-menu-item>
            </ui-trigger-menu-group>
            <ui-trigger-menu-separator></ui-trigger-menu-separator>
          </ui-trigger-menu-list>
        </ui-trigger-menu-content>
      </template>
    </ui-trigger-menu>
  `
  const menu = root.querySelector("ui-trigger-menu")!
  menu.triggers = triggers
}

export { mount }
