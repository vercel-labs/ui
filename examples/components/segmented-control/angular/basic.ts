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
      <label uiFieldLabel>View</label>
      <div uiSegmentedControl defaultValue="list">
        <span uiSegmentedControlIndicator></span>
        <button uiSegmentedControlItem value="list">List</button>
        <button uiSegmentedControlItem value="grid">Grid</button>
        <button uiSegmentedControlItem value="board">Board</button>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
