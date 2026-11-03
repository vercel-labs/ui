"use client"

import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuGroup,
  TriggerMenuGroupLabel,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
  TriggerMenuSeparator,
} from "@ui-sdk/react/trigger-menu"
import { UsersIcon } from "lucide-react"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

function Example() {
  return (
    <TriggerMenu
      triggers={[
        {
          char: "@",
          spaces: 2,
          maxLength: 30,
          pattern: /[\p{L}.'-]/u,
          filter: "startsWith",
          insert: (item) => `@${item.label.split(" ")[0]} `,
        },
      ]}
    >
      <TriggerMenuInput aria-label="Message" placeholder="Type @ and a first name" />
      <TriggerMenuContent>
        <TriggerMenuList>
          <TriggerMenuGroup>
            <TriggerMenuGroupLabel>People</TriggerMenuGroupLabel>
            {people.map((person) => (
              <TriggerMenuItem
                key={person.value}
                value={person.value}
                label={person.label}
                keywords={person.keywords}
                disabled={person.disabled}
              >
                <span aria-hidden="true" data-slot="badge">
                  {person.label[0]}
                </span>
                {person.label}
              </TriggerMenuItem>
            ))}
          </TriggerMenuGroup>
          <TriggerMenuSeparator />
          <TriggerMenuItem
            value="here"
            label="here"
            keywords={["everyone", "channel"]}
            onSelect={(value, details) => details.insert("@here ")}
          >
            <TriggerMenuItemIcon>
              <UsersIcon />
            </TriggerMenuItemIcon>
            Notify everyone here
          </TriggerMenuItem>
        </TriggerMenuList>
      </TriggerMenuContent>
    </TriggerMenu>
  )
}

export { Example }
