import { Component, computed, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/angular/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

type Mode = "fuzzy" | "contains" | "startsWith" | "words"

function words(item: { label: string }, query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) =>
      item.label
        .toLowerCase()
        .split(" ")
        .some((part) => part.startsWith(word))
    )
}

@Component({
  imports: [
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container
          uiSelect
          [items]="modes"
          [value]="mode()"
          (beforeValueChange)="$event.value && mode.set($event.value)"
        >
          <div uiSelectLabel>Filter</div>
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of modes; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div uiCommand [filter]="filter()">
        <input
          uiCommandInput
          aria-label="Search commands"
          placeholder="Try “nf”, “zo in” or “smiley”"
        />
        <div uiCommandEmpty>No results found.</div>
        <div uiCommandList>
          @for (command of commands; track command.label) {
            <div
              uiCommandItem
              [value]="command.label"
              [keywords]="command.keywords"
            >
              {{ command.label }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly commands = [
    { label: "Home" },
    { label: "Inbox", keywords: ["mail", "messages"] },
    { label: "Documents" },
    { label: "Downloads" },
    { label: "New file" },
    { label: "New folder" },
    { label: "Copy" },
    { label: "Paste" },
    { label: "Delete", keywords: ["remove", "trash"] },
    { label: "Zoom in" },
    { label: "Zoom out" },
    { label: "Search emoji", keywords: ["smiley", "face"] },
    { label: "Keyboard shortcuts", keywords: ["hotkeys"] },
    { label: "Settings", keywords: ["preferences"] },
  ]

  readonly modes = [
    { value: "fuzzy", label: "Fuzzy" },
    { value: "contains", label: "Contains" },
    { value: "startsWith", label: "Starts with" },
    { value: "words", label: "Words" },
  ]

  readonly mode = signal<Mode>("fuzzy")

  readonly filter = computed(() => {
    const mode = this.mode()
    return mode === "words" ? words : mode
  })
}

export { Example }
