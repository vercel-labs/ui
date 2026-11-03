"use client"

import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuItemIcon,
  TriggerMenuList,
} from "@ui-sdk/react/trigger-menu"
import { ClockIcon, ReplyIcon, SearchIcon, ShareIcon, TrashIcon } from "lucide-react"

const commands = [
  { value: "reply", icon: ReplyIcon, mirror: true },
  { value: "remind", icon: ClockIcon },
  { value: "search", icon: SearchIcon },
  { value: "share", icon: ShareIcon },
  { value: "clear", icon: TrashIcon },
]

function Example() {
  return (
    <TriggerMenu triggers={[{ char: "/", boundary: "start", type: "command" }]}>
      <TriggerMenuInput aria-label="Message" placeholder="Type / for commands" />
      <TriggerMenuContent>
        <TriggerMenuList>
          {commands.map((command) => (
            <TriggerMenuItem key={command.value} value={command.value}>
              <TriggerMenuItemIcon mirror={command.mirror}>
                <command.icon />
              </TriggerMenuItemIcon>
              {command.value}
            </TriggerMenuItem>
          ))}
        </TriggerMenuList>
      </TriggerMenuContent>
    </TriggerMenu>
  )
}

export { Example }
