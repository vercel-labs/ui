import { createSignal, Show } from "solid-js"
import { Button } from "@ui-sdk/solid/button"

function Example() {
  const [submitted, setSubmitted] = createSignal<{ email: string; count: number }>()

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        const email = String(new FormData(event.currentTarget).get("email"))
        setSubmitted((current) => ({ email, count: (current?.count ?? 0) + 1 }))
      }}
      onReset={() => setSubmitted(undefined)}
    >
      <label data-slot="label">
        Email
        <input name="email" type="email" defaultValue="ada@example.com" />
      </label>
      <div data-slot="row">
        <Button type="submit">Subscribe</Button>
        <Button type="reset">Reset</Button>
      </div>
      <output data-slot="output">
        <Show when={submitted()}>
          {(current) =>
            `Submitted: ${current().email} (${current().count} ${current().count === 1 ? "time" : "times"})`
          }
        </Show>
      </output>
    </form>
  )
}

export { Example }
