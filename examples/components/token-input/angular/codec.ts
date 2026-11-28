import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  fromText,
  toText,
  TokenInput,
  TokenInputEditor,
  type TokenCodec,
} from "@ui-sdk/angular/token-input"

@Component({
  imports: [Field, FieldLabel, TokenInput, TokenInputEditor],
  template: `
    <div uiField>
      <label uiFieldLabel>Message</label>
      <div
        uiTokenInput
        [codec]="chat"
        copy="label"
        [defaultValue]="draft"
        (beforeValueChange)="log(toText($event.value, chat))"
      >
        <div uiTokenInputEditor></div>
      </div>
    </div>
  `,
})
class Example {
  readonly chat: TokenCodec = {
    format: (token) => `<@${token.value}>`,
    parse: (text) =>
      text.split(/(<@[\w.-]+>)/).map((part) => {
        const id = /^<@([\w.-]+)>$/.exec(part)?.[1]
        return id ? { type: "mention", value: id, label: `@${id}` } : part
      }),
  }

  readonly draft = fromText(
    "Ping <@hollis> and <@ines> about the launch",
    this.chat
  )

  readonly log = useLog()

  readonly toText = toText
}

export { Example }
