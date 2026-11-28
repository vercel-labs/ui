import { Component } from "@angular/core"
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from "@ui-sdk/angular/toolbar"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Toolbar, ToolbarButton, ToolbarSeparator],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div uiToolbar class="toolbar" aria-label="Tools">
        <span uiToolbarButton (click)="action.set('span')">Span tool</span>
        <button uiToolbarButton (click)="action.set('cut')">Cut</button>
        <button uiToolbarButton (click)="action.set('copy')">Copy</button>
        <hr uiToolbarSeparator class="rule" />
        <a
          uiToolbarButton
          #old="uiToolbarButton"
          href="#old"
          disabled
          [class.is-disabled]="old.state().disabled"
          [class.is-enabled]="!old.state().disabled"
          >Old docs</a
        >
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
    </div>
  `,
})
class Fixture {
  readonly action = state("")
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
