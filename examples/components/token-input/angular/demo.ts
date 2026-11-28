import { Component } from "@angular/core"
import { LucideX } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenDef,
  TokenInputTokenRemove,
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
    TokenInputToken,
    TokenInputTokenDef,
    TokenInputTokenRemove,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuItem,
    TriggerMenuList,
    LucideX,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Message</label>
      <div uiTokenInput>
        <div uiTokenInputEditor placeholder="Type @ to mention someone…"></div>
        <span *uiTokenInputTokenDef="let token" uiTokenInputToken>
          {{ token.label }}
          <span uiTokenInputTokenRemove>
            <svg lucideX></svg>
          </span>
        </span>
        <ng-container
          uiTriggerMenu
          [triggers]="[{ char: '@', type: 'mention', items: people }]"
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
  readonly people = [
    { value: "hollis", label: "Hollis Grant" },
    { value: "ines", label: "Inès Moreau" },
    { value: "kofi", label: "Kofi Mensah" },
    { value: "wren", label: "Wren Takahashi" },
    { value: "tomasz", label: "Tomasz Wójcik" },
  ]

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

export { Example }
