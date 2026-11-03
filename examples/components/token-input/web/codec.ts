import {
  fromText,
  toLabel,
  toText,
  type Token,
  type TokenCodec,
  type TokenInputValue,
} from "@ui-sdk/core/token-input"
import "@ui-sdk/web/token-input"

const slack: TokenCodec = {
  format: (token: Token) => `<@${token.value}>`,
  parse: (text: string) =>
    text.split(/(<@[\w.-]+>)/).map((part) => {
      const id = /^<@([\w.-]+)>$/.exec(part)?.[1]
      return id ? { type: "mention", value: id, label: `@${id}` } : part
    }),
}

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <dl>
        <dt>Codec</dt><dd data-show="codec"></dd>
        <dt>Default</dt><dd data-show="default"></dd>
        <dt>Label</dt><dd data-show="label"></dd>
      </dl>
    </div>
  `
  const input = document.createElement("ui-token-input")
  input.setAttribute("copy", "label")
  input.codec = slack
  input.defaultValue = fromText("Ping <@ada> and <@grace>", slack)
  input.innerHTML = `<ui-token-input-editor aria-label="Message"></ui-token-input-editor>`
  root.firstElementChild!.prepend(input)
  const show = (value: TokenInputValue) => {
    root.querySelector('[data-show="codec"]')!.textContent = toText(value, slack)
    root.querySelector('[data-show="default"]')!.textContent = toText(value)
    root.querySelector('[data-show="label"]')!.textContent = toLabel(value)
  }
  show(input.value)
  input.addEventListener("valuechange", (event) => show(event.detail.value))
}
