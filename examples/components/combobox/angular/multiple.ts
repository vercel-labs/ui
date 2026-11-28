import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideX } from "@lucide/angular"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxChip,
    ComboboxChipRemove,
    ComboboxChips,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
    LucideCheck,
    LucideChevronDown,
    LucideX,
  ],
  template: `
    <ng-container
      uiCombobox
      multiple
      [defaultValue]="['next', 'astro']"
      [itemToLabel]="frameworkLabel"
    >
      <div data-slot="stack">
        <label uiComboboxLabel>Frameworks</label>
        <div data-slot="row">
          <div uiComboboxChips>
            <span uiComboboxValue #comboboxValue="uiComboboxValue">
              @for (
                value of itemsOf(comboboxValue.state().value);
                track value;
                let index = $index
              ) {
                <div uiComboboxChip [value]="value">
                  {{ comboboxValue.state().labels[index] }}
                  <button
                    uiComboboxChipRemove
                    [attr.aria-label]="\`Remove \${comboboxValue.state().labels[index]}\`"
                  >
                    <svg lucideX></svg>
                  </button>
                </div>
              }
            </span>
            <input uiComboboxInput placeholder="Add a framework…" />
          </div>
          <button uiComboboxTrigger aria-label="Show frameworks">
            <svg lucideChevronDown></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent>
        <div uiComboboxEmpty>No frameworks found.</div>
        <div uiComboboxList>
          @for (framework of frameworks; track framework.value) {
            <div
              uiComboboxItem
              [value]="framework.value"
              [label]="framework.label"
            >
              {{ framework.label }}
              <span *uiComboboxItemIndicator>
                <svg lucideCheck></svg>
              </span>
            </div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly frameworks = [
    { value: "next", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt", label: "Nuxt" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
    { value: "solidstart", label: "SolidStart" },
    { value: "qwik", label: "Qwik City" },
  ]

  readonly frameworkLabel = (value: string) =>
    this.frameworks.find((framework) => framework.value === value)?.label ??
    value

  itemsOf(items: unknown) {
    return items as string[]
  }
}

export { Example }
