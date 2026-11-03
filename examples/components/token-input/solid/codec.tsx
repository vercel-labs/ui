import {
  fromText,
  toLabel,
  toText,
  TokenInput,
  TokenInputEditor,
  type Token,
  type TokenCodec,
  type TokenInputValue,
} from "@ui-sdk/solid/token-input"
import { createSignal } from "solid-js"

const slack: TokenCodec = {
  format: (token: Token) => `<@${token.value}>`,
  parse: (text: string) =>
    text.split(/(<@[\w.-]+>)/).map((part) => {
      const id = /^<@([\w.-]+)>$/.exec(part)?.[1]
      return id ? { type: "mention", value: id, label: `@${id}` } : part
    }),
}

export function Example() {
  const [value, setValue] = createSignal<TokenInputValue>(fromText("Ping <@ada> and <@grace>", slack))
  return (
    <div data-slot="stack">
      <TokenInput codec={slack} copy="label" value={value()} onValueChange={(next) => setValue(next)}>
        <TokenInputEditor aria-label="Message" />
      </TokenInput>
      <dl>
        <dt>Codec</dt>
        <dd>{toText(value(), slack)}</dd>
        <dt>Default</dt>
        <dd>{toText(value())}</dd>
        <dt>Label</dt>
        <dd>{toLabel(value())}</dd>
      </dl>
    </div>
  )
}
