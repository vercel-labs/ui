import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { dynamic } from "@solidjs/web"
import { createSignal, For } from "solid-js"

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
const CreditCard = icon(
  '<rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /><path d="M6 14h2" />',
)
const Landmark = icon(
  '<path d="M10 18v-7" /><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" /><path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M3 22h18" /><path d="M6 18v-7" />',
)
const Wallet = icon(
  '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />',
)

const methods = [
  { value: "card", label: "Credit card", icon: CreditCard },
  { value: "wallet", label: "Wallet", icon: Wallet },
  { value: "bank", label: "Bank transfer", icon: Landmark, disabled: true },
]

export function Example() {
  const [method, setMethod] = createSignal("card")
  const current = () => methods.find((option) => option.value === method())!
  const CurrentIcon = dynamic(() => current().icon)

  return (
    <div data-slot="stack">
      <Menu>
        <MenuTrigger>
          <CurrentIcon />
          Payment method
        </MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value={method()} onValueChange={setMethod}>
            <MenuGroupLabel>Pay with</MenuGroupLabel>
            <For each={methods}>
              {(option) => (
                <MenuRadioItem value={option.value} disabled={option.disabled}>
                  <option.icon />
                  {option.label}
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
        </MenuContent>
      </Menu>
      <output data-slot="output">Paying with {current().label.toLowerCase()}</output>
    </div>
  )
}
