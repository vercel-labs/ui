import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { createSignal, For } from "solid-js"

const accounts = [
  { value: "personal", name: "Riley Park", initials: "RP" },
  { value: "studio", name: "North Studio", initials: "NS" },
]

function Example() {
  const [account, setAccount] = createSignal("personal")
  const [action, setAction] = createSignal("")
  const current = () => accounts.find((option) => option.value === account())!

  return (
    <div data-slot="stack">
      <Menu onAction={setAction}>
        <MenuTrigger aria-label="Account">{current().initials}</MenuTrigger>
        <MenuContent align="end">
          <div data-slot="row">
            <span data-slot="badge">{current().initials}</span>
            <div data-slot="stack">
              <div>{current().name}</div>
              <div data-slot="hint">{current().value}@example.com</div>
            </div>
          </div>
          <MenuSeparator />
          <MenuRadioGroup value={account()} onValueChange={setAccount}>
            <MenuGroupLabel>Switch account</MenuGroupLabel>
            <For each={accounts}>
              {(option) => (
                <MenuRadioItem value={option.value} closeOnSelect>
                  <span data-slot="badge">{option.initials}</span>
                  {option.name}
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
                </MenuRadioItem>
              )}
            </For>
          </MenuRadioGroup>
          <MenuItem value="add-account">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
            Add account
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="settings">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Settings
          </MenuItem>
          <MenuItem value="sign-out">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
            Sign out
          </MenuItem>
        </MenuContent>
      </Menu>
      <output data-slot="output">{action() ? `Ran ${action()}` : `Signed in as ${current().name}`}</output>
    </div>
  )
}

export { Example }
