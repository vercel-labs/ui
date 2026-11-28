import { Component } from "@angular/core"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/angular/command"
import { commandFixture as f } from "../../../../../tests/fixtures/command"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Command, CommandInput, CommandItem, CommandList],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCommand
        #command="uiCommand"
        class="command"
        [class.is-paged]="!!command.state().page"
        [class.is-first]="!command.state().page"
        (action)="action.set('action:' + $event.value)"
      >
        <input uiCommandInput class="input" [attr.aria-label]="f.input" />
        <div uiCommandList class="command-list">
          <a uiCommandItem class="item" value="docs" href="#docs">Docs</a>
          @for (item of items; track item.value) {
            <div
              uiCommandItem
              #row="uiCommandItem"
              class="item"
              [value]="item.value"
              [label]="item.label"
              [class.is-highlighted]="row.state().highlighted"
              [textContent]="item.label + (row.state().highlighted ? ' ←' : '')"
            ></div>
          }
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = f
  readonly items = f.groups[0].items.slice(0, 2)
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
