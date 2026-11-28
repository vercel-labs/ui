import { Component } from "@angular/core"
import { LucideCheck, LucideMinus } from "@lucide/angular"
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
} from "@ui-sdk/angular/checkbox"

@Component({
  imports: [
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
    LucideCheck,
    LucideMinus,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="stack">
        <h3 id="disabled-backups">Backups</h3>
        <p data-slot="hint">Managed by your organization.</p>
        <div
          uiCheckboxGroup
          aria-labelledby="disabled-backups"
          [defaultValue]="['photos', 'documents']"
          disabled
        >
          @for (item of backups; track item.value) {
            <label data-slot="label">
              <button uiCheckbox [value]="item.value">
                <span uiCheckboxIndicator>
                  <svg lucideCheck></svg>
                </span>
              </button>
              {{ item.label }}
            </label>
          }
        </div>
      </div>
      <div data-slot="stack">
        <h3 id="disabled-folders">Sync folders</h3>
        <div
          uiCheckboxGroup
          aria-labelledby="disabled-folders"
          [defaultValue]="['desktop']"
          [allValues]="folders.map((item) => item.value)"
        >
          <label data-slot="label">
            <button uiCheckbox parent>
              <span uiCheckboxIndicator>
                <svg lucideCheck></svg>
                <svg lucideMinus></svg>
              </span>
            </button>
            Select all
          </label>
          <div data-slot="stack">
            @for (item of folders; track item.value) {
              <label data-slot="label">
                <button
                  uiCheckbox
                  [value]="item.value"
                  [disabled]="item.disabled"
                >
                  <span uiCheckboxIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </button>
                {{ item.label }}
              </label>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly backups = [
    { value: "photos", label: "Photos" },
    { value: "documents", label: "Documents" },
    { value: "messages", label: "Messages" },
  ]

  readonly folders = [
    { value: "desktop", label: "Desktop", disabled: true },
    { value: "projects", label: "Projects", disabled: false },
    { value: "downloads", label: "Downloads", disabled: false },
  ]
}

export { Example }
