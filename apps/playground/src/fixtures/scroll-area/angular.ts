import { Component } from "@angular/core"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/angular/scroll-area"
import {
  scrollAreaFixture,
  scrollAreaOptions,
} from "../../../../../tests/fixtures/scroll-area"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaCorner,
    ScrollAreaScrollToEnd,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  ],
  template: `
    <div class="fixture scroll-fixture">
      <button>Before</button>
      <div
        uiScrollArea
        class="scroll-area"
        [type]="options.type"
        [scrollHideDelay]="options.scrollHideDelay"
      >
        <div
          *uiScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          [attr.aria-label]="f.tags.label"
        >
          <div *uiScrollAreaContent>
            @for (item of f.tags.items; track item) {
              <p class="scroll-area-item">{{ item }}</p>
            }
          </div>
        </div>
        @if (!options.native) {
          <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
            <div uiScrollAreaThumb class="scroll-area-thumb"></div>
          </div>
        }
      </div>
      <div
        uiScrollArea
        class="scroll-area is-wide"
        [type]="options.type"
        [scrollHideDelay]="options.scrollHideDelay"
      >
        <div
          *uiScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          [attr.aria-label]="f.gallery.label"
        >
          <div *uiScrollAreaContent class="scroll-area-grid">
            @for (item of f.gallery.items; track item) {
              <a [href]="'#' + item">{{ item }}</a>
            }
          </div>
        </div>
        <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
        <div
          uiScrollAreaScrollbar
          class="scroll-area-scrollbar"
          orientation="horizontal"
        >
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
        <div uiScrollAreaCorner class="scroll-area-corner"></div>
      </div>
      <div
        uiScrollArea
        class="scroll-area"
        [type]="options.type"
        [scrollHideDelay]="options.scrollHideDelay"
      >
        <div
          *uiScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          [attr.aria-label]="f.short.label"
        >
          <div *uiScrollAreaContent>
            @for (item of f.short.items; track item) {
              <p class="scroll-area-item">{{ item }}</p>
            }
          </div>
        </div>
        <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
      </div>
      <div
        uiScrollArea
        class="scroll-area is-chat"
        stickToEnd
        [type]="options.type"
        [scrollHideDelay]="options.scrollHideDelay"
      >
        <div
          *uiScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          [attr.aria-label]="f.chat.label"
        >
          <div *uiScrollAreaContent>
            @for (message of messages(); track $index) {
              <p class="scroll-area-message">
                {{ message.text }}
                @if (message.image) {
                  <span
                    role="img"
                    aria-label="Image"
                    style="display: block"
                    [style.height.px]="imagesLoaded() ? f.chat.imageHeight : 0"
                  ></span>
                }
              </p>
            }
          </div>
        </div>
        <div uiScrollAreaScrollbar class="scroll-area-scrollbar">
          <div uiScrollAreaThumb class="scroll-area-thumb"></div>
        </div>
        <button uiScrollAreaScrollToEnd class="scroll-area-end">
          {{ f.chat.jump }}
        </button>
      </div>
      <button (click)="addMessage()">Add message</button>
      <button (click)="stream()">Stream</button>
      <button (click)="addMessage(true)">Add image</button>
      <button (click)="imagesLoaded.set(true)">Load images</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <div class="scroll-fixture-spacer"></div>
    </div>
  `,
})
class Fixture {
  readonly f = scrollAreaFixture
  readonly options = scrollAreaOptions()
  readonly messages = state<{ text: string; image?: boolean }[]>(
    scrollAreaFixture.chat.messages.map((text) => ({ text }))
  )
  readonly imagesLoaded = state(false)

  addMessage(image = false) {
    const messages = this.messages()
    this.messages.set([
      ...messages,
      { text: `Message ${messages.length + 1}`, image },
    ])
  }

  stream() {
    const messages = this.messages()
    const last = messages[messages.length - 1]
    this.messages.set([
      ...messages.slice(0, -1),
      { ...last, text: last.text + scrollAreaFixture.chat.streamed },
    ])
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
