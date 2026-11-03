import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@ui-sdk/solid/autocomplete"
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { createSignal, For } from "solid-js"

const fruits = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Grape",
  "Lemon",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Pineapple",
  "Strawberry",
]

function Example() {
  const [submitted, setSubmitted] = createSignal("")
  return (
    <form
      id="order"
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        const data = [...new FormData(event.currentTarget)].map(([name, value]) => `${name}=${value}`)
        setSubmitted(data.join("&"))
      }}
    >
      <Field>
        <FieldLabel>Fruit</FieldLabel>
        <Autocomplete name="fruit" form="order" required defaultValue="Apple">
          <AutocompleteInput />
          <AutocompleteContent>
            <AutocompleteList>
              <For each={fruits}>{(fruit) => <AutocompleteItem value={fruit}>{fruit}</AutocompleteItem>}</For>
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
        <FieldDescription>Any fruit, listed or not.</FieldDescription>
        <div>
          <FieldError />
        </div>
      </Field>
      <div data-slot="row">
        <button type="submit" data-variant="solid">
          Submit
        </button>
        <button type="reset">Reset</button>
      </div>
      <output data-slot="output">{submitted() || "Not submitted"}</output>
    </form>
  )
}

export { Example }
