import { DateInput, DateInputSegment } from "@ui-sdk/solid/date-input"
import { Field, FieldLabel } from "@ui-sdk/solid/field"
import { For } from "solid-js"

function Example() {
  return (
    <Field>
      <FieldLabel>Start date</FieldLabel>
      <DateInput defaultValue="2026-11-02">
        {(state) => (
          <For each={state.segments} keyed={(segment) => segment.key}>
            {(segment) =>
              segment().editable ? (
                <DateInputSegment segment={segment()} />
              ) : (
                <DateInputSegment segment={segment()}>–</DateInputSegment>
              )
            }
          </For>
        )}
      </DateInput>
    </Field>
  )
}

export { Example }
