import { Component } from "@angular/core"
import { LucideCornerDownLeft } from "@lucide/angular"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
} from "@ui-sdk/angular/command"

@Component({
  imports: [
    Command,
    CommandInput,
    CommandItem,
    CommandItemText,
    CommandList,
    LucideCornerDownLeft,
  ],
  template: `
    <div uiCommand>
      <input
        uiCommandInput
        aria-label="Search docs"
        placeholder="Search docs…"
      />
      <div uiCommandList>
        @for (page of pages; track page) {
          <a
            uiCommandItem
            #commandItem="uiCommandItem"
            [value]="page"
            href="#{{ page.toLowerCase() }}"
            ><span uiCommandItemText #commandItemText="uiCommandItemText">
              @for (
                segment of commandItemText.state().segments;
                track index;
                let index = $index
              ) {
                @if (segment.match) {
                  <strong>{{ segment.text }}</strong>
                } @else {
                  <span>{{ segment.text }}</span>
                }
              }
            </span>
            @if (commandItem.state().highlighted) {
              <svg lucideCornerDownLeft></svg>
            }
          </a>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly pages = ["Composition", "Installation", "Styling"]
}

export { Example }
