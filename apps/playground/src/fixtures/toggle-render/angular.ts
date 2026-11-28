import { Component } from "@angular/core"
import { Button } from "@ui-sdk/angular/button"
import { Separator } from "@ui-sdk/angular/separator"
import { Toggle, ToggleGroup } from "@ui-sdk/angular/toggle"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [Button, Separator, Toggle, ToggleGroup],
  template: `
    <div class="fixture">
      <button>Before</button>
      <span uiButton class="button" (click)="action.set('span')">
        Span button
      </span>
      <a uiButton class="button" disabled href="#old">Old docs</a>
      <button
        uiToggle
        #star="uiToggle"
        class="toggle"
        [class.is-pressed]="star.state().pressed"
        [class.is-unpressed]="!star.state().pressed"
        (pressedChange)="action.set($event ? 'star' : 'unstar')"
      >
        <span aria-hidden="true">{{ star.state().pressed ? "★" : "☆" }}</span>
        Star
      </button>
      <div
        uiToggleGroup
        class="toggle-group"
        aria-label="View"
        [defaultValue]="['grid']"
        (valueChange)="action.set($event.join(', '))"
      >
        <span uiToggle class="toggle" value="grid">Grid</span>
        <span uiToggle class="toggle" value="list">List</span>
      </div>
      <hr uiSeparator class="rule" />
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
