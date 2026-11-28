import { Component } from "@angular/core"
import { LucideMinus, LucidePlus } from "@lucide/angular"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@ui-sdk/angular/number-input"
import {
  Toolbar,
  ToolbarInput,
  ToolbarSeparator,
} from "@ui-sdk/angular/toolbar"

@Component({
  imports: [
    NumberInput,
    NumberInputControl,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    Toolbar,
    ToolbarInput,
    ToolbarSeparator,
    LucideMinus,
    LucidePlus,
  ],
  template: `
    <div uiToolbar aria-label="Text">
      <div uiNumberInput [defaultValue]="14" [min]="8" [max]="72">
        <div uiNumberInputGroup>
          <button uiNumberInputDecrement aria-label="Decrease font size">
            <svg lucideMinus></svg>
          </button>
          <input uiNumberInputControl uiToolbarInput aria-label="Font size" />
          <button uiNumberInputIncrement aria-label="Increase font size">
            <svg lucidePlus></svg>
          </button>
        </div>
      </div>
      <div uiToolbarSeparator></div>
      <input uiToolbarInput aria-label="Find" placeholder="Find…" />
    </div>
  `,
})
class Example {}

export { Example }
