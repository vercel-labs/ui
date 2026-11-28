import { Component } from "@angular/core"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/angular/segmented-control"

@Component({
  imports: [
    Field,
    FieldLabel,
    SegmentedControl,
    SegmentedControlIndicator,
    SegmentedControlItem,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Vertical alignment</label>
      <div uiSegmentedControl orientation="vertical" defaultValue="middle">
        <span uiSegmentedControlIndicator></span>
        <button uiSegmentedControlItem value="top">Top</button>
        <button uiSegmentedControlItem value="middle">Middle</button>
        <button uiSegmentedControlItem value="bottom">Bottom</button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
