import { Component } from "@angular/core"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  type TriggerDefinition,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuList,
} from "@ui-sdk/angular/trigger-menu"

@Component({
  imports: [
    Field,
    FieldControl,
    FieldLabel,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuInput,
    TriggerMenuList,
  ],
  template: `
    <ng-container uiTriggerMenu [triggers]="triggers">
      <div uiField>
        <label uiFieldLabel>Message</label>
        <textarea
          uiTriggerMenuInput
          uiFieldControl
          placeholder="Type @, / or #…"
        ></textarea>
      </div>
      <div *uiTriggerMenuContent>
        <div uiTriggerMenuList></div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik" },
  ]

  readonly commands = ["away", "remind", "search", "status"]

  readonly channels = [
    "announcements",
    "design",
    "design-reviews",
    "engineering",
    "general",
    "launches",
    "support",
  ]

  readonly searchChannels = (
    query: string,
    { signal }: { signal: AbortSignal }
  ) =>
    new Promise<string[]>((resolve, reject) => {
      const timer = setTimeout(
        () =>
          resolve(
            this.channels.filter((channel) =>
              channel.includes(query.toLowerCase())
            )
          ),
        400
      )
      signal.addEventListener("abort", () => {
        clearTimeout(timer)
        reject(signal.reason)
      })
    })

  readonly triggers: TriggerDefinition[] = [
    { char: "@", items: this.people },
    { char: "/", boundary: "start", items: this.commands },
    { char: "#", items: this.searchChannels },
  ]
}

export { Example }
