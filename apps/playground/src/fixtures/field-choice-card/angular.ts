import { Component, DestroyRef, inject } from "@angular/core"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import {
  fieldChoiceCardFixture,
  fieldChoiceCardOptions,
} from "../../../../../tests/fixtures/field"
import { mountAngular, state } from "../../angular-mount"

@Component({
  selector: "fixture-later-card",
  host: { style: "display: contents" },
  imports: [Checkbox, CheckboxIndicator, Field, FieldDescription, FieldLabel],
  template: `
    <label uiFieldLabel class="choice-card">
      <div uiField>
        @if (ready()) {
          <button uiCheckbox class="checkbox" [name]="f.later.name">
            <span *uiCheckboxIndicator class="checkbox-indicator"></span>
          </button>
        }
        <span>{{ f.later.title }}</span>
        <p uiFieldDescription>{{ f.later.description }}</p>
      </div>
    </label>
  `,
})
class LaterCard {
  readonly f = fieldChoiceCardFixture
  readonly ready = state(false)

  constructor() {
    const timer = setTimeout(
      () => this.ready.set(true),
      fieldChoiceCardFixture.later.delay
    )
    inject(DestroyRef).onDestroy(() => clearTimeout(timer))
  }
}

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Field,
    FieldDescription,
    FieldLabel,
    LaterCard,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      @for (card of f.cards; track card.name) {
        <label uiFieldLabel class="choice-card">
          <div uiField>
            <button uiCheckbox class="checkbox" [name]="card.name">
              <span *uiCheckboxIndicator class="checkbox-indicator"></span>
            </button>
            <span>{{ card.title }}</span>
            <p uiFieldDescription>{{ card.description }}</p>
          </div>
        </label>
      }
      @if (options.later) {
        <fixture-later-card />
      }
      @if (options.alone) {
        <label uiFieldLabel>{{ f.alone }}</label>
      }
      <button>After</button>
    </div>
  `,
})
class Fixture {
  readonly f = fieldChoiceCardFixture
  readonly options = fieldChoiceCardOptions()
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, LaterCard, mount }
