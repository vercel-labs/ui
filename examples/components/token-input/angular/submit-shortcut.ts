import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  toLabel,
  TokenInput,
  TokenInputEditor,
} from "@ui-sdk/angular/token-input"

@Component({
  imports: [Field, FieldLabel, TokenInput, TokenInputEditor],
  template: `
    <div uiField>
      <label uiFieldLabel>Message</label>
      <div
        uiTokenInput
        submitShortcut="mod+enter"
        (submit)="log('Sent ' + toLabel($event.value))"
      >
        <div uiTokenInputEditor placeholder="Write a message…"></div>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly toLabel = toLabel
}

export { Example }
