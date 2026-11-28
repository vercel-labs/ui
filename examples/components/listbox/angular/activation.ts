import { Component } from "@angular/core"
import { LucideFile } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Listbox, ListboxItem, ListboxItemIcon } from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem, ListboxItemIcon, LucideFile],
  template: `
    <div
      uiListbox
      multiple
      activation="automatic"
      [defaultValue]="['readme']"
      (beforeValueChange)="
        log($event.value.length + ' selected (' + $event.reason + ')')
      "
      aria-label="Files"
    >
      @for (file of files; track file.value) {
        <div uiListboxItem [value]="file.value">
          <span uiListboxItemIcon>
            <svg lucideFile></svg>
          </span>
          {{ file.label }}
        </div>
      }
    </div>
  `,
})
class Example {
  readonly files = [
    { value: "readme", label: "README.md" },
    { value: "package", label: "package.json" },
    { value: "tsconfig", label: "tsconfig.json" },
    { value: "index", label: "index.ts" },
    { value: "styles", label: "styles.css" },
    { value: "logo", label: "logo.svg" },
  ]

  readonly log = useLog()
}

export { Example }
