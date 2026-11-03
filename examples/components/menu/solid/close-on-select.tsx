import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { createSignal } from "solid-js"

function Example() {
  const [zoom, setZoom] = createSignal(100)
  const [fit, setFit] = createSignal(false)

  return (
    <Menu>
      <MenuTrigger aria-label={`Zoom ${fit() ? "to fit" : `${zoom()}%`}`}>
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
        {fit() ? "Fit" : `${zoom()}%`}
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>Zoom {zoom()}%</MenuGroupLabel>
          <MenuItem
            closeOnSelect={false}
            disabled={zoom() >= 200}
            onSelect={() => setZoom(Math.min(200, zoom() + 10))}
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
            Zoom in
          </MenuItem>
          <MenuItem
            closeOnSelect={false}
            disabled={zoom() <= 50}
            onSelect={() => setZoom(Math.max(50, zoom() - 10))}
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
            Zoom out
          </MenuItem>
          <MenuItem onSelect={() => setZoom(100)}>Reset to 100%</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem value="fit" checked={fit()} onCheckedChange={setFit} closeOnSelect>
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
          Fit to window
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
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>
  )
}

export { Example }
