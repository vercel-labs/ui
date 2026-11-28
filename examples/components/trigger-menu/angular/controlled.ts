import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
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
    <ng-container
      uiTriggerMenu
      [triggers]="[
        { char: '@', items: people },
        { char: '/', boundary: 'start', items: commands },
      ]"
      [(open)]="open"
      (beforeOpenChange)="
        log(($event.value ? 'Opening' : 'Closing') + ' (' + $event.reason + ')')
      "
      (openChangeComplete)="log($event ? 'Open' : 'Closed')"
      (beforeQueryChange)="
        log(
          'Query “' +
            $event.value +
            '”' +
            ($event.argument ? ' for ' + $event.argument : '')
        )
      "
      shortcut="ctrl+j"
    >
      <div uiField>
        <label uiFieldLabel>Message</label>
        <textarea
          uiTriggerMenuInput
          uiFieldControl
          placeholder="Type @ or /…"
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

  readonly commands = [
    {
      value: "status",
      label: "status",
      arguments: [
        {
          name: "status",
          hint: "<status>",
          required: true,
          items: ["available", "busy", "away"],
        },
      ],
    },
  ]

  readonly log = useLog()

  readonly open = signal(false)
}

export { Example }
