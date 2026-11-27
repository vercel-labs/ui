import { afterNextRender, Component, viewChild } from "@angular/core"
import {
  fromText,
  toText,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenDef,
  TokenInputTokenRemove,
  type TokenInputValue,
  type TokenInputValueChange,
} from "@ui-sdk/angular/token-input"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuHint,
  TriggerMenuItem,
  TriggerMenuList,
  type TriggerMenuDataItem,
  type TriggerMenuSelect,
} from "@ui-sdk/angular/trigger-menu"
import {
  pendingSelect,
  tokenInputFixture,
  tokenInputOptions,
  tokenTriggers,
} from "../../../../../tests/fixtures/token-input"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
    TokenInputTokenDef,
    TokenInputTokenRemove,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuHint,
    TriggerMenuItem,
    TriggerMenuList,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="composer"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event, '')"
      >
        <div
          uiTokenInput
          [tokenDeletion]="options.tokenDeletion"
          [submitShortcut]="options.submitShortcut"
          [copy]="options.copy"
          [disabled]="options.disabled"
          [readOnly]="options.readOnly"
          [name]="f.name"
          [form]="options.otherForm ? 'other' : undefined"
          [defaultValue]="options.controlled ? undefined : initial"
          [value]="options.controlled ? current() : undefined"
          (beforeValueChange)="onValueChange($event)"
        >
          <label class="label" id="prompt-label">{{ f.label }}</label>
          <div
            uiTokenInputEditor
            class="editor"
            aria-labelledby="prompt-label"
            [placeholder]="f.placeholder"
          ></div>
          <span
            *uiTokenInputTokenDef="let token"
            uiTokenInputToken
            class="token"
          >
            {{ token.label }}
            <span uiTokenInputTokenRemove> ×</span>
          </span>
          <ng-container
            uiTriggerMenu
            [triggers]="triggers"
            (itemSelect)="onSelect($event)"
          >
            <span *uiTriggerMenuHint class="hint"></span>
            <div *uiTriggerMenuContent class="popup list-popup">
              <div uiTriggerMenuList #list="uiTriggerMenuList">
                @for (item of itemsOf(list.state().items); track item.value) {
                  <div
                    uiTriggerMenuItem
                    class="item"
                    [value]="item.value"
                    [label]="item.label"
                    [disabled]="item.disabled"
                  >
                    {{ item.label }}
                  </div>
                }
              </div>
            </div>
          </ng-container>
        </div>
        <button type="submit">{{ f.submit }}</button>
      </form>
      @if (options.otherForm) {
        <form
          id="other"
          aria-label="Other"
          (submit)="onSubmit($event, 'other:')"
        ></form>
      }
      <textarea [attr.aria-label]="f.scratch"></textarea>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = tokenInputFixture
  readonly options = tokenInputOptions()
  readonly triggers = tokenTriggers()
  readonly initial = fromText(this.options.value)
  readonly current = state<TokenInputValue>(this.initial)
  readonly action = state("")
  readonly submitted = state("")
  readonly input = viewChild.required(TokenInput)

  constructor() {
    // Without a listener, the shortcut submits the form, which ?form asks for.
    if (!this.options.form) {
      afterNextRender(() =>
        this.input().submit.subscribe((submit) =>
          this.submitted.set(toText(submit.value))
        )
      )
    }
  }

  onValueChange(change: TokenInputValueChange) {
    this.current.set(change.value)
    this.action.set(`${change.reason}:${toText(change.value)}`)
  }

  onSelect(select: TriggerMenuSelect) {
    if (this.options.pending && select.trigger === "@") {
      select.waitUntil(pendingSelect({ fail: this.options.fail }))
    }
  }

  onSubmit(event: SubmitEvent, prefix: string) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    this.submitted.set(`${prefix}${data.get(tokenInputFixture.name)}`)
  }

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
