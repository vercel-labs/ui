import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { render } from "@solidjs/web"

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Popover>
        <PopoverTrigger
          class={(state) => (state.open ? "is-open" : "is-closed")}
          render={(props, state) => (
            <button {...props}>
              Details <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
            </button>
          )}
        />
        <PopoverContent class="popup">
          <PopoverTitle render={(props) => <h3 {...props} />}>
            Shipping
          </PopoverTitle>
          <PopoverClose render={(props) => <a {...props} href="#done" />}>
            Done
          </PopoverClose>
        </PopoverContent>
      </Popover>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
