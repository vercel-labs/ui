import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { createSignal } from "solid-js"

function Example() {
  const [title, setTitle] = createSignal("")
  const [status, setStatus] = createSignal("Draft")
  const blocked = () => !title().trim()

  return (
    <div data-slot="stack">
      <input
        value={title()}
        onInput={(event) => setTitle(event.currentTarget.value)}
        placeholder="Post title"
        aria-label="Post title"
      />
      <div data-slot="row">
        <Tooltip disabled={!blocked()}>
          <TooltipTrigger
            aria-disabled={blocked() ? "true" : undefined}
            onClick={() => {
              if (!blocked()) {
                setStatus(`Published “${title().trim()}”`)
              }
            }}
          >
            Publish
          </TooltipTrigger>
          <TooltipContent>Add a title to publish</TooltipContent>
        </Tooltip>
        <output data-slot="output">{status()}</output>
      </div>
    </div>
  )
}

export { Example }
