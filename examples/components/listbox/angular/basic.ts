import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/angular/field"
import {
  Listbox,
  ListboxItem,
  ListboxItemIndicator,
} from "@ui-sdk/angular/listbox"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldLabel,
    Listbox,
    ListboxItem,
    ListboxItemIndicator,
    LucideCheck,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Email me about</label>
      <div
        uiListbox
        multiple
        activation="automatic"
        [defaultValue]="['mentions']"
      >
        @for (topic of topics; track topic.value) {
          <div uiListboxItem [value]="topic.value">
            {{ topic.label }}
            <span *uiListboxItemIndicator>
              <svg lucideCheck></svg>
            </span>
          </div>
        }
      </div>
      <p uiFieldDescription>
        Hold Shift to select a range, or Ctrl or ⌘ to add one.
      </p>
    </div>
  `,
})
class Example {
  readonly topics = [
    { value: "comments", label: "Comments" },
    { value: "mentions", label: "Mentions" },
    { value: "reactions", label: "Reactions" },
    { value: "sign-ins", label: "New sign-ins" },
    { value: "billing", label: "Billing" },
  ]
}

export { Example }
