import { Component } from "@angular/core"
import { Field, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/angular/field"
import { Input, InputClear, InputGroup } from "@ui-sdk/angular/input"
import { Textarea } from "@ui-sdk/angular/textarea"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Field,
    FieldLabel,
    FieldLegend,
    FieldSet,
    Input,
    InputClear,
    InputGroup,
    Textarea,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <fieldset uiFieldSet class="form">
        <div uiFieldLegend>Legend as a div</div>
        <div uiField>
          <label uiFieldLabel>Render function</label>
          <input
            uiInput
            #input="uiInput"
            class="input"
            [attr.data-state]="input.state().filled ? 'filled' : 'empty'"
          />
        </div>
        <div uiField>
          <label uiFieldLabel>Class from state</label>
          <textarea
            uiTextarea
            #textarea="uiTextarea"
            class="textarea"
            autoResize
            [class.is-filled]="textarea.state().filled"
            [class.is-empty]="!textarea.state().filled"
          ></textarea>
        </div>
        <div uiInputGroup class="input-group">
          <input uiInput class="input" aria-label="Search" />
          <span
            uiInputClear
            role="button"
            tabindex="0"
            aria-label="Clear search"
            >×</span
          >
        </div>
      </fieldset>
      <button type="button" (click)="renders.set(renders() + 1)">
        Render again ({{ renders() }})
      </button>
      <button>After</button>
    </div>
  `,
})
class Fixture {
  readonly renders = state(0)
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
