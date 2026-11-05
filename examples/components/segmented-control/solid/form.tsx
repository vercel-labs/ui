import { Field, FieldLabel } from "@ui-sdk/solid/field"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/solid/segmented-control"
import { useLog } from "../../../shared/solid/log"

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
