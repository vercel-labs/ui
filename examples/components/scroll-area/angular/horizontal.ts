import { Component } from "@angular/core"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/angular/scroll-area"

@Component({
  imports: [
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  ],
  template: `
    <div uiScrollArea type="auto">
      <div *uiScrollAreaViewport role="region" aria-label="Palette">
        <div *uiScrollAreaContent>
          <ul>
            @for (swatch of swatches; track swatch.name) {
              <li>
                <div data-slot="swatch" [style.background]="swatch.color"></div>
                {{ swatch.name }}
              </li>
            }
          </ul>
        </div>
      </div>
      <div uiScrollAreaScrollbar orientation="horizontal">
        <div uiScrollAreaThumb></div>
      </div>
    </div>
  `,
})
class Example {
  readonly swatches = [
    { name: "Sand", color: "#e6d8bf" },
    { name: "Clay", color: "#c98b6b" },
    { name: "Rust", color: "#a4502f" },
    { name: "Moss", color: "#7d8b5a" },
    { name: "Sage", color: "#b5c2a3" },
    { name: "Fog", color: "#c9d1d6" },
    { name: "Slate", color: "#5b6b78" },
    { name: "Ink", color: "#2b2f36" },
  ]
}

export { Example }
