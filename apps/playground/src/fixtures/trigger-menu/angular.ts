import { Component, input, output } from "@angular/core"
import {
  TriggerMenu,
  TriggerMenuContent,
  type TriggerMenuDataItem,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
  type TriggerMenuOpenChange,
  type TriggerMenuSelect,
  TriggerMenuStatus,
} from "@ui-sdk/angular/trigger-menu"
import {
  fixtureTriggers,
  selectAction,
  triggerMenuFixture,
  triggerMenuOptions,
} from "../../../../../tests/fixtures/trigger-menu"
import { mountAngular, state } from "../../angular-mount"

let composers = 0

@Component({
  selector: "fixture-composer",
  host: { style: "display: contents" },
  imports: [
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuEmpty,
    TriggerMenuHint,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuList,
    TriggerMenuStatus,
  ],
  template: `
    <ng-container
      uiTriggerMenu
      [triggers]="triggers"
      [autoHighlight]="options.autoHighlight"
      (beforeOpenChange)="onOpenChange($event)"
      (itemSelect)="onSelect($event)"
    >
      <label class="label" [attr.for]="id">{{ name() }}</label>
      @if (options.input) {
        <input uiTriggerMenuInput class="input" name="message" [id]="id" />
      } @else {
        <textarea
          uiTriggerMenuInput
          class="input"
          name="message"
          [id]="id"
        ></textarea>
      }
      <span uiTriggerMenuHint class="hint"></span>
      <div uiTriggerMenuStatus class="status"></div>
      <div *uiTriggerMenuContent class="popup list-popup">
        @if (options.empty) {
          <div uiTriggerMenuEmpty class="empty">{{ f.empty }}</div>
        }
        <div uiTriggerMenuList #list="uiTriggerMenuList">
          @for (item of itemsOf(list.state().items); track item.value) {
            <div
              uiTriggerMenuItem
              class="item"
              [value]="item.value"
              [label]="item.label"
              [disabled]="item.disabled"
              [textContent]="item.label"
            ></div>
          }
        </div>
      </div>
    </ng-container>
  `,
})
class Composer {
  readonly name = input.required<string>()
  readonly acted = output<string>()
  readonly opened = output<string>()
  readonly f = triggerMenuFixture
  readonly options = triggerMenuOptions()
  readonly triggers = fixtureTriggers()
  readonly id = `composer-${++composers}`

  itemsOf(items: unknown) {
    return items as TriggerMenuDataItem[]
  }

  onOpenChange(change: TriggerMenuOpenChange) {
    this.opened.emit(`${change.value}:${change.reason}`)
  }

  onSelect(selection: TriggerMenuSelect) {
    this.acted.emit(selectAction(selection.value, selection.arguments))
  }
}

@Component({
  imports: [Composer],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="composer"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <fixture-composer
          [name]="f.label"
          (acted)="action.set($event)"
          (opened)="open.set($event)"
        />
        @if (options.twice) {
          <fixture-composer
            name="Second"
            (acted)="action.set($event)"
            (opened)="open.set($event)"
          />
        }
        <button type="submit">{{ f.submit }}</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Open">{{ open() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = triggerMenuFixture
  readonly options = triggerMenuOptions()
  readonly action = state("")
  readonly open = state("")
  readonly submitted = state("")

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    this.submitted.set(String(new FormData(form).get("message")))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Composer, Fixture, mount }
