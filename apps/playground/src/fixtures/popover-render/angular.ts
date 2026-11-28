import { Component } from "@angular/core"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"
import { mountAngular } from "../../angular-mount"

@Component({
  imports: [
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <ng-container uiPopover>
        <button
          uiPopoverTrigger
          #trigger="uiPopoverTrigger"
          [class]="trigger.state().open ? 'is-open' : 'is-closed'"
        >
          Details
          <span aria-hidden="true">{{ trigger.state().open ? "▲" : "▼" }}</span>
        </button>
        <div *uiPopoverContent class="popup">
          <h3 uiPopoverTitle>Shipping</h3>
          <a uiPopoverClose href="#done">Done</a>
        </div>
      </ng-container>
      <button>After</button>
    </div>
  `,
})
class Fixture {}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
