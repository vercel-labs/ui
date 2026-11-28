import { Component, computed, signal } from "@angular/core"
import { Button } from "@ui-sdk/angular/button"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import { useLog } from "../../../shared/angular/log"

@Component({
  imports: [Button, Field, FieldLabel, Input],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Title</label>
        <input uiInput [(value)]="title" />
      </div>
      <div data-slot="row">
        <button
          uiButton
          [disabled]="!ready()"
          focusableWhenDisabled
          aria-describedby="publish-hint"
          (action)="log('Published “' + title() + '”')"
        >
          Publish
        </button>
        <p id="publish-hint" data-slot="hint">
          {{ ready() ? "Ready to publish." : "Add a title to publish." }}
        </p>
      </div>
    </div>
  `,
})
class Example {
  readonly log = useLog()
  readonly title = signal("")
  readonly ready = computed(() => this.title().trim() !== "")
}

export { Example }
