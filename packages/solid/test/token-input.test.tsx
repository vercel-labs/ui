import { createSignal, flush } from "solid-js"
import { render } from "@solidjs/web"
import { afterEach, expect, test } from "vitest"
import { TokenInput, TokenInputEditor } from "../src/token-input"

let dispose: (() => void) | undefined
afterEach(() => {
  dispose?.()
  document.body.replaceChildren()
})

test("a token input named after mount renders the textarea its form submits", async () => {
  const [name, setName] = createSignal<string>()
  dispose = render(
    () => (
      <form>
        <TokenInput defaultValue={["Hello"]} name={name()}>
          <TokenInputEditor aria-label="Prompt" />
        </TokenInput>
      </form>
    ),
    document.body,
  )
  flush()
  await new Promise((resolve) => setTimeout(resolve))
  setName("prompt")
  flush()
  await new Promise((resolve) => setTimeout(resolve))
  expect(new FormData(document.querySelector("form")!).get("prompt")).toBe("Hello")
})
