import { createSignal, createUniqueId } from "solid-js"
import { Button } from "@ui-sdk/solid/button"

function Example() {
  const [title, setTitle] = createSignal("")
  const [published, setPublished] = createSignal(false)
  const hint = createUniqueId()
  const ready = () => title().trim() !== ""

  return (
    <div data-slot="stack">
      <label data-slot="label">
        Title
        <input
          value={title()}
          onInput={(event) => {
            setTitle(event.currentTarget.value)
            setPublished(false)
          }}
        />
      </label>
      <div data-slot="row">
        <Button
          disabled={!ready()}
          focusableWhenDisabled
          aria-describedby={hint}
          onClick={() => setPublished(true)}
        >
          Publish
        </Button>
        <p id={hint}>
          {!ready() ? "Add a title to publish." : published() ? "Published." : "Ready to publish."}
        </p>
      </div>
    </div>
  )
}

export { Example }
