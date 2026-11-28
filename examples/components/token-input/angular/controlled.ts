import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  toText,
  TokenInput,
  TokenInputEditor,
  type TokenInputValue,
  type TokenInputOptions,
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
    TokenInput,
    TokenInputEditor,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuItem,
    TriggerMenuList,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Prompt</label>
      <div
        uiTokenInput
        [(value)]="value"
        (beforeValueChange)="onValueChange($event)"
        [history]="{ limit: 50, groupDelay: 1000 }"
        [getTokenDescription]="getTokenDescription"
      >
        <div uiTokenInputEditor></div>
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
  `,
})
class Example {
  readonly files = [
    { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
    { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
    { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
    { value: "README.md", label: "README.md" },
    { value: "package.json", label: "package.json" },
  ]

  readonly draft: TokenInputValue = [
    "Explain ",
    { type: "file", value: "src/routes.ts", label: "routes.ts" },
    " in two sentences.",
  ]

  readonly log = useLog()

  readonly value = signal<TokenInputValue>(this.draft)

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }

  onValueChange(change: TokenInputValueChange) {
    const removed = change.removed.map((token) => token.label).join(", ")
    this.log(
      `${toText(change.value)} (${change.reason}${removed ? `, removed ${removed}` : ""})`
    )
  }

  readonly getTokenDescription: TokenInputOptions["getTokenDescription"] = (
    token
  ) => (token.type === "file" ? "attached file" : token.type)
}

export { Example }
