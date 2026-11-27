import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuHint,
  TriggerMenuInput,
  TriggerMenuList,
  type TriggerMenuSelect,
} from "@ui-sdk/angular/trigger-menu"

@Component({
  imports: [
    Field,
    FieldControl,
    FieldLabel,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuHint,
    TriggerMenuInput,
    TriggerMenuList,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <ng-container
        uiTriggerMenu
        [triggers]="[
          { char: '/', boundary: 'start', type: 'command', items: commands },
        ]"
        (itemSelect)="onSelect($event)"
      >
        <div uiField name="message">
          <label uiFieldLabel>Message</label>
          <textarea
            uiTriggerMenuInput
            uiFieldControl
            placeholder="Type / for commands…"
          ></textarea>
        </div>
        <span uiTriggerMenuHint></span>
        <div *uiTriggerMenuContent>
          <div uiTriggerMenuList></div>
        </div>
      </ng-container>
    </form>
  `,
})
class Example {
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
        {
          name: "until",
          hint: "[until]",
          items: ["30m", "1h", "4h", "today"],
          allowCustomValue: false,
        },
      ],
    },
    {
      value: "search",
      label: "search",
      arguments: [{ name: "query", hint: "<query>", required: true }],
    },
    { value: "away", label: "away", after: "submit" as const },
    { value: "clear", label: "clear" },
  ]

  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.log(
      `Sent ${new FormData(event.currentTarget as HTMLFormElement).get("message")}`
    )
  }

  onSelect(select: TriggerMenuSelect) {
    this.log(
      ["Chose", `/${select.value}`, ...Object.values(select.arguments)].join(
        " "
      )
    )
  }
}

export { Example }
