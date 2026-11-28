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
    <div dir="rtl">
      <div uiScrollArea>
        <div *uiScrollAreaViewport>
          <div *uiScrollAreaContent>
            <h4>الوسوم</h4>
            @for (tag of tags; track tag) {
              <div>
                {{ tag }}
              </div>
            }
          </div>
        </div>
        <div uiScrollAreaScrollbar>
          <div uiScrollAreaThumb></div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly tags = Array.from({ length: 40 }, (_, index) => `وسم ${index + 1}`)
}

export { Example }
