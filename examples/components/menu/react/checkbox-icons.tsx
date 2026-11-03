import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { BellIcon, CheckIcon, MailIcon, SmartphoneIcon } from "lucide-react"
import * as React from "react"

const channels = [
  { value: "email", label: "Email", icon: MailIcon },
  { value: "sms", label: "Text message", icon: SmartphoneIcon },
  { value: "push", label: "Push", icon: BellIcon },
]

export function Example() {
  const [enabled, setEnabled] = React.useState(["email", "push"])

  return (
    <div data-slot="stack">
      <Menu>
        <MenuTrigger>
          <BellIcon />
          Notifications
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Notify me by</MenuGroupLabel>
            {channels.map((channel) => (
              <MenuCheckboxItem
                key={channel.value}
                value={channel.value}
                checked={enabled.includes(channel.value)}
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
                    {state.checked && <CheckIcon />}
                  </div>
                )}
              />
            ))}
          </MenuGroup>
        </MenuContent>
      </Menu>
      <output data-slot="output">
        {enabled.length ? `On: ${enabled.join(", ")}` : "All notifications off"}
      </output>
    </div>
  )
}
