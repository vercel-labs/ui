import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown, LucideFile } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"
import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenDef,
  type TokenDeletion,
  type TokenInputValue,
  type TokenInputValueChange,
} from "@ui-sdk/angular/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/angular/trigger-menu"

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
    TokenInputTokenDef,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuItem,
    TriggerMenuList,
    LucideCheck,
    LucideChevronDown,
    LucideFile,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container
          uiSelect
          [items]="modes"
          [value]="deletion()"
          (beforeValueChange)="$event.value && deletion.set($event.value)"
        >
          <div uiSelectLabel>Backspace</div>
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (mode of modes; track mode.value) {
              <div uiSelectItem [value]="mode.value">
                {{ mode.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div uiField>
        <label uiFieldLabel>Prompt</label>
        <div
          uiTokenInput
          [tokenDeletion]="deletion()"
          [defaultValue]="draft"
          (beforeValueChange)="onValueChange($event)"
        >
          <div uiTokenInputEditor></div>
          <span *uiTokenInputTokenDef="let token" uiTokenInputToken>
            <svg lucideFile></svg>
            {{ token.label }}
          </span>
          <ng-container
            uiTriggerMenu
            [triggers]="[{ char: '@', type: 'file', items: files }]"
          >
            <div *uiTriggerMenuContent>
              <div uiTriggerMenuList #triggerMenuList="uiTriggerMenuList">
                @for (
                  item of itemsOf(triggerMenuList.state().items);
                  track item.value
                ) {
                  <div
                    uiTriggerMenuItem
                    [value]="item.value"
                    [label]="item.label"
                  >
                    {{ item.label }}
                  </div>
                }
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly modes = [
    { value: "whole", label: "Whole" },
    { value: "select", label: "Select" },
    { value: "revert", label: "Revert" },
  ]

  readonly files = [
    { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
    { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
    { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
    { value: "README.md", label: "README.md" },
    { value: "package.json", label: "package.json" },
  ]

  readonly draft: TokenInputValue = [
    "Explain ",
    {
      type: "file",
      value: "src/routes.ts",
      label: "routes.ts",
      data: { trigger: "@" },
    },
    " in two sentences.",
  ]

  readonly log = useLog()

  readonly deletion = signal<TokenDeletion>("whole")

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }

  onValueChange(change: TokenInputValueChange) {
    for (const token of change.removed) {
      this.log(`Removed ${token.label} (${this.deletion()})`)
    }
  }
}

export { Example }
