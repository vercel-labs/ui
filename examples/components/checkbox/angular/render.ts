import { Component } from "@angular/core"
import { LucideCheck, LucidePlus } from "@lucide/angular"
import { Checkbox } from "@ui-sdk/angular/checkbox"

@Component({
  imports: [Checkbox, LucideCheck, LucidePlus],
  template: `
    <fieldset>
      <legend>Topics you follow</legend>
      <div data-slot="row">
        @for (topic of topics; track topic.value) {
          <button
            uiCheckbox
            #checkbox="uiCheckbox"
            name="topics"
            [value]="topic.value"
            [defaultChecked]="topic.checked"
          >
            @if (checkbox.state().checked) {
              <svg lucideCheck></svg>
            } @else {
              <svg lucidePlus></svg>
            }
            {{ topic.label }}
          </button>
        }
      </div>
    </fieldset>
  `,
})
class Example {
  readonly topics = [
    { value: "design", label: "Design", checked: true },
    { value: "engineering", label: "Engineering", checked: false },
    { value: "marketing", label: "Marketing", checked: false },
    { value: "sales", label: "Sales", checked: false },
  ]
}

export { Example }
