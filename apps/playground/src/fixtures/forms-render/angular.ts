import { Component } from "@angular/core"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup } from "@ui-sdk/angular/radio"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Field,
    FieldControl,
    FieldLabel,
    Radio,
    RadioGroup,
    Switch,
    SwitchThumb,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        aria-label="Rendering"
        (submit)="$event.preventDefault()"
      >
        <label>
          <span
            uiCheckbox
            class="checkbox"
            (checkedChange)="action.set('span:' + $event)"
          >
            <span *uiCheckboxIndicator class="checkbox-indicator"></span>
          </span>
          Rendered as a span
        </label>
        <button uiCheckbox #toggled="uiCheckbox" aria-label="Render function">
          {{ toggled.state().checked ? "On" : "Off" }}
        </button>
        <button
          uiCheckbox
          #classed="uiCheckbox"
          class="checkbox"
          aria-label="Class from state"
          [class.is-checked]="classed.state().checked"
          [class.is-unchecked]="!classed.state().checked"
        ></button>
        <label>
          <button uiSwitch class="switch" defaultChecked>
            <span uiSwitchThumb #thumb="uiSwitchThumb">{{
              thumb.state().checked ? "I" : "O"
            }}</span>
          </button>
          Labelled thumb
        </label>
        <div
          uiRadioGroup
          aria-label="Size"
          defaultValue="small"
          (valueChange)="action.set('size:' + $event)"
        >
          @for (size of sizes; track size.value) {
            <label>
              <span uiRadio class="radio" [value]="size.value"></span>
              {{ size.label }}
            </label>
          }
        </div>
        <div uiField>
          <label uiFieldLabel>Nickname</label>
          <input
            uiFieldControl
            [value]="nickname()"
            (input)="nickname.set($any($event.target).value)"
          />
        </div>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly sizes = [
    { value: "small", label: "Small" },
    { value: "large", label: "Large" },
  ]
  readonly action = state("")
  readonly nickname = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
