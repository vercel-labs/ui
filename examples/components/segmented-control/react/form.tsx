"use client"

import { Field, FieldLabel } from "@ui-sdk/react/field"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control"
import { useLog } from "../../../shared/react/log"

function Example() {
  const log = useLog()

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        log(`Submitted billing=${new FormData(event.currentTarget).get("billing")}`)
      }}
    >
      <Field>
        <FieldLabel>Billing period</FieldLabel>
        <SegmentedControl name="billing" required defaultValue="monthly">
          <SegmentedControlIndicator />
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
          <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
        </SegmentedControl>
      </Field>
      <div data-slot="row">
        <button type="submit" data-variant="solid">
          Continue
        </button>
        <button type="reset">Reset</button>
      </div>
    </form>
  )
}

export { Example }
