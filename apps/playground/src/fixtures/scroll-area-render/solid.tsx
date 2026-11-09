import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import { render } from "@solidjs/web"
import { For } from "solid-js"

const notes = Array.from({ length: 40 }, (_, index) => `Note ${index + 1}`)
const renders = ((window as unknown as { renders: { root: number } }).renders =
  { root: 0 })

// The root rendered as a section, whose content is a function of its state.
// It counts its renders, which only an edge flipping should cause.
function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <ScrollArea
        render={(props) => <section {...props} />}
        class="scroll-area"
      >
        {(state) => {
          renders.root++
          return (
            <>
              <p class="render-status">{state.atEnd ? "At end" : "Reading"}</p>
              <ScrollAreaViewport
                render={(props) => <article {...props} />}
                class="scroll-area-viewport"
                role="region"
                aria-label="Notes"
              >
                <For each={notes}>
                  {(note) => <p class="scroll-area-item">{note}</p>}
                </For>
              </ScrollAreaViewport>
              <ScrollAreaScrollbar class="scroll-area-scrollbar">
                <ScrollAreaThumb class="scroll-area-thumb" />
              </ScrollAreaScrollbar>
            </>
          )
        }}
      </ScrollArea>
      <button>After</button>
      <output role="status" aria-label="Last action" />
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
