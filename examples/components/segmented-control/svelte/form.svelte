<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { SegmentedControl, SegmentedControlIndicator, SegmentedControlItem } from "@ui-sdk/svelte/segmented-control"
  import { useLog } from "../../../shared/svelte/log"

  const log = useLog()

  function onSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault()
    log(`Submitted billing=${new FormData(event.currentTarget).get("billing")}`)
  }
</script>

<form data-slot="stack" onsubmit={onSubmit}>
  <Field>
    <FieldLabel>Billing period</FieldLabel>
    <SegmentedControl name="billing" required defaultValue="monthly">
      <SegmentedControlIndicator />
      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
    </SegmentedControl>
  </Field>
  <div data-slot="row">
    <button type="submit" data-variant="solid">Continue</button>
    <button type="reset">Reset</button>
  </div>
</form>
