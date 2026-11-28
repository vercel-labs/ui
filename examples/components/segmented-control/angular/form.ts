import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/angular/segmented-control"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldLabel,
    SegmentedControl,
    SegmentedControlIndicator,
    SegmentedControlItem,
  ],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <div uiField>
        <label uiFieldLabel>Theme</label>
        <div uiSegmentedControl name="theme" required defaultValue="system">
          <span uiSegmentedControlIndicator></span>
          <button uiSegmentedControlItem value="light">Light</button>
          <button uiSegmentedControlItem value="dark">Dark</button>
          <button uiSegmentedControlItem value="system">System</button>
        </div>
        <p uiFieldDescription>System follows your device's setting.</p>
      </div>
      <div uiField>
        <label uiFieldLabel>Density</label>
        <div uiSegmentedControl name="density" defaultValue="comfortable">
          <span uiSegmentedControlIndicator></span>
          <button uiSegmentedControlItem value="compact">Compact</button>
          <button uiSegmentedControlItem value="comfortable">
            Comfortable
          </button>
        </div>
      </div>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    this.log(`Saved theme=${data.get("theme")}, density=${data.get("density")}`)
  }
}

export { Example }
