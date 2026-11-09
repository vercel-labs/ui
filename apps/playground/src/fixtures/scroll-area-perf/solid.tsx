import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import {
  countRender,
  mountWhenAsked,
  perfItems,
  perfSize,
} from "tests/fixtures/perf.ts"

// A scroll area of N items for the counts specs, with its
// scrollbar always shown. The content, the thumb and every item count their
// renders.
const items = perfItems(perfSize())

function Item(props: { label: string }) {
  countRender("item")
  return <p class="scroll-area-item">{props.label}</p>
}

function Fixture() {
  return (
    <div class="fixture scroll-fixture">
      <button>Before</button>
      <ScrollArea class="scroll-area" type="always">
        <ScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          aria-label="Items"
        >
          <ScrollAreaContent
            render={(props) => {
              countRender("content")
              return <div {...props} />
            }}
          >
            <For each={items}>{(item) => <Item label={item.label} />}</For>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar class="scroll-area-scrollbar">
          <ScrollAreaThumb
            class="scroll-area-thumb"
            render={(props) => {
              countRender("thumb")
              return <div {...props} />
            }}
          />
        </ScrollAreaScrollbar>
      </ScrollArea>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => render(() => <Fixture />, target))
}

export { mount }
