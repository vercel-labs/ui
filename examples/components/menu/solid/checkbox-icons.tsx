import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { createSignal, For, Show } from "solid-js"

const icon = (markup: string) => () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    innerHTML={markup}
  />
)
const Bell = icon(
  '<path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />',
)
const Mail = icon(
  '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" />',
)
const Smartphone = icon('<rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />')

const channels = [
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "Text message", icon: Smartphone },
  { value: "push", label: "Push", icon: Bell },
]

export function Example() {
  const [enabled, setEnabled] = createSignal(["email", "push"])

  return (
    <div data-slot="stack">
      <Menu>
        <MenuTrigger>
          <Bell />
          Notifications
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Notify me by</MenuGroupLabel>
            <For each={channels}>
              {(channel) => (
                <MenuCheckboxItem
                  value={channel.value}
                  checked={enabled().includes(channel.value)}
                  onCheckedChange={(checked) =>
                    setEnabled((current) =>
                      checked
                        ? [...current, channel.value]
                        : current.filter((value) => value !== channel.value),
                    )
                  }
                  render={(props, state) => (
                    <div {...props}>
                      <channel.icon />
                      {channel.label}
                      <Show when={state.checked}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </Show>
                    </div>
                  )}
                />
              )}
            </For>
          </MenuGroup>
        </MenuContent>
      </Menu>
      <output data-slot="output">
        {enabled().length ? `On: ${enabled().join(", ")}` : "All notifications off"}
      </output>
    </div>
  )
}
