import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Listbox,
  ListboxItem,
  ListboxItemIndicator,
} from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem, ListboxItemIndicator, LucideCheck],
  template: `
    <div
      uiListbox
      activation="manual"
      virtualFocus
      (beforeValueChange)="
        log(($event.value ?? 'Nothing') + ' (' + $event.reason + ')')
      "
      aria-label="Framework"
    >
      @for (framework of frameworks; track framework.value) {
        <div uiListboxItem [value]="framework.value">
          {{ framework.label }}
          <span *uiListboxItemIndicator>
            <svg lucideCheck></svg>
          </span>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly frameworks = [
    { value: "next", label: "Next.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
    { value: "nuxt", label: "Nuxt" },
    { value: "sveltekit", label: "SvelteKit" },
  ]

  readonly log = useLog()
}

export { Example }
