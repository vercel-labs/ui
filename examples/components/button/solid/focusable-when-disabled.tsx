import { createSignal, createUniqueId } from "solid-js"
import { Button } from "@ui-sdk/solid/button"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/solid/field"
import { useLog } from "../../../shared/solid/log"

function Example() {
  const log = useLog()
  const [title, setTitle] = createSignal("")
  const hint = createUniqueId()
  const ready = () => title().trim() !== ""

  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Title</FieldLabel>
        <FieldControl value={title()} onInput={(event) => setTitle(event.currentTarget.value)} />
      </Field>
      <div data-slot="row">
        <Button
          disabled={!ready()}
          focusableWhenDisabled
          aria-describedby={hint}
          onClick={() => log(`Published “${title()}”`)}
        >
          Publish
        </Button>
        <p id={hint} data-slot="hint">
          {ready() ? "Ready to publish." : "Add a title to publish."}
        </p>
      </div>
    </div>
  )
}

export { Example }
