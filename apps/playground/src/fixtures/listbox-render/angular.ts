import { Component } from "@angular/core"
import { Listbox, ListboxItem } from "@ui-sdk/angular/listbox"
import {
  listboxAction,
  listboxFixture as f,
} from "../../../../../tests/fixtures/listbox"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Listbox, ListboxItem],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ul
        uiListbox
        class="listbox"
        activation="manual"
        [attr.aria-label]="f.label"
        (valueChange)="action.set(listboxAction($event))"
      >
        <a uiListboxItem class="item" value="docs" href="#docs">Docs</a>
        <li
          uiListboxItem
          #star="uiListboxItem"
          class="item"
          value="star"
          [class.is-selected]="star.state().selected"
          [class.is-unselected]="!star.state().selected"
          [textContent]="(star.state().selected ? '★' : '☆') + ' Star'"
        ></li>
        @for (item of items; track item.value) {
          <li uiListboxItem class="item" [value]="item.value">
            {{ item.label }}
          </li>
        }
      </ul>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = f
  readonly listboxAction = listboxAction
  readonly items = f.items.slice(0, 3)
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
