import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Radio, RadioGroup } from "@ui-sdk/angular/radio"

let nextId = 0

@Component({
  imports: [Field, FieldLabel, Radio, RadioGroup, LucideCheck],
  template: `
    <div uiField>
      <label uiFieldLabel>Notify me about</label>
      <div uiRadioGroup defaultValue="mentions">
        @for (option of options; track option.value) {
          <button
            uiRadio
            #radio="uiRadio"
            [value]="option.value"
            [aria-labelledby]="\`\${id}-\${option.value}-label\`"
            [aria-describedby]="\`\${id}-\${option.value}-description\`"
          >
            <span data-slot="stack">
              <span [id]="\`\${id}-\${option.value}-label\`">{{
                option.label
              }}</span>
              <span
                data-slot="hint"
                [id]="\`\${id}-\${option.value}-description\`"
                >{{ option.description }}</span
              >
            </span>
            <svg
              lucideCheck
              [attr.data-checked]="radio.state().checked ? '' : null"
            ></svg>
          </button>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly options = [
    {
      value: "all",
      label: "Everything",
      description: "Every message and update.",
    },
    {
      value: "mentions",
      label: "Mentions",
      description: "Only when someone mentions you.",
    },
    { value: "none", label: "Nothing", description: "Turn notifications off." },
  ]

  readonly id = `plan-${nextId++}`
}

export { Example }
