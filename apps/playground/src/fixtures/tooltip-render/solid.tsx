import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { render } from "@solidjs/web"

function Fixture() {
  return (
    <div class="fixture tooltip-page">
      <button>Before</button>
      <Tooltip delay={100}>
        <TooltipTrigger render={(props) => <a {...props} href="#docs" />}>
          Docs
        </TooltipTrigger>
        <TooltipContent class="tooltip">Read the docs</TooltipContent>
      </Tooltip>
      <Tooltip delay={100}>
        <TooltipTrigger
          class={(state) => (state.open ? "is-open" : "is-closed")}
          render={(props, state) => (
            <button {...props}>
              Status <span aria-hidden="true">{state.open ? "●" : "○"}</span>
            </button>
          )}
        />
        <TooltipContent
          class={(state) => (state.open ? "tooltip is-open" : "tooltip")}
        >
          All systems normal
        </TooltipContent>
      </Tooltip>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
