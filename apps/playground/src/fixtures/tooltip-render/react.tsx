import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { createRoot } from "react-dom/client"

function Fixture() {
  return (
    <div className="fixture tooltip-page">
      <button>Before</button>
      <Tooltip delay={100}>
        <TooltipTrigger render={<a href="#docs" />}>Docs</TooltipTrigger>
        <TooltipContent className="tooltip">Read the docs</TooltipContent>
      </Tooltip>
      <Tooltip delay={100}>
        <TooltipTrigger
          className={(state) => (state.open ? "is-open" : "is-closed")}
          render={(props, state) => (
            <button {...props}>
              Status <span aria-hidden="true">{state.open ? "●" : "○"}</span>
            </button>
          )}
        />
        <TooltipContent
          className={(state) => (state.open ? "tooltip is-open" : "tooltip")}
        >
          All systems normal
        </TooltipContent>
      </Tooltip>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
