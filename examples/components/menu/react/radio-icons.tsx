import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { CheckIcon, CreditCardIcon, LandmarkIcon, WalletIcon } from "lucide-react"
import * as React from "react"

const methods = [
  { value: "card", label: "Credit card", icon: CreditCardIcon },
  { value: "wallet", label: "Wallet", icon: WalletIcon },
  { value: "bank", label: "Bank transfer", icon: LandmarkIcon, disabled: true },
]

export function Example() {
  const [method, setMethod] = React.useState("card")
  const current = methods.find((option) => option.value === method)!

  return (
    <div data-slot="stack">
      <Menu>
        <MenuTrigger>
          <current.icon />
          Payment method
        </MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value={method} onValueChange={setMethod}>
            <MenuGroupLabel>Pay with</MenuGroupLabel>
            {methods.map((option) => (
              <MenuRadioItem key={option.value} value={option.value} disabled={option.disabled}>
                <option.icon />
                {option.label}
                <CheckIcon />
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
      <output data-slot="output">Paying with {current.label.toLowerCase()}</output>
    </div>
  )
}
