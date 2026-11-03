import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/solid/toolbar"
import { createSignal, For } from "solid-js"

const zooms = ["50%", "75%", "100%", "150%", "200%"]

function Example() {
  const [zoom, setZoom] = createSignal("100%")
  const index = () => zooms.indexOf(zoom())
  return (
    <Toolbar aria-label="View">
      <ToolbarButton
        data-variant="secondary"
        aria-label="Zoom out"
        disabled={index() === 0}
        onClick={() => setZoom(zooms[index() - 1])}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" x2="16.65" y1="21" y2="16.65" />
          <line x1="8" x2="14" y1="11" y2="11" />
        </svg>
      </ToolbarButton>
      <Select value={zoom()} onValueChange={(value) => value && setZoom(value)}>
        <ToolbarButton
          data-variant="secondary"
          render={(props) => <SelectTrigger {...props} />}
          aria-label="Zoom"
        >
          <SelectValue />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </ToolbarButton>
        <SelectContent>
          <For each={zooms}>
            {(zoom) => (
              <SelectItem value={zoom}>
                {zoom}
                <SelectItemIndicator>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </SelectItemIndicator>
              </SelectItem>
            )}
          </For>
        </SelectContent>
      </Select>
      <ToolbarButton
        data-variant="secondary"
        aria-label="Zoom in"
        disabled={index() === zooms.length - 1}
        onClick={() => setZoom(zooms[index() + 1])}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" x2="16.65" y1="21" y2="16.65" />
          <line x1="11" x2="11" y1="8" y2="14" />
          <line x1="8" x2="14" y1="11" y2="11" />
        </svg>
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton data-variant="secondary" aria-label="Fit to screen" onClick={() => setZoom("100%")}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      </ToolbarButton>
    </Toolbar>
  )
}

export { Example }
