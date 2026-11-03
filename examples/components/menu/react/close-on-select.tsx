"use client"

import * as React from "react"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { CheckIcon, MonitorIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react"

function Example() {
  const [zoom, setZoom] = React.useState(100)
  const [fit, setFit] = React.useState(false)

  return (
    <Menu>
      <MenuTrigger aria-label={`Zoom ${fit ? "to fit" : `${zoom}%`}`}>
        <ZoomInIcon />
        {fit ? "Fit" : `${zoom}%`}
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>Zoom {zoom}%</MenuGroupLabel>
          <MenuItem
            closeOnSelect={false}
            disabled={zoom >= 200}
            onSelect={() => setZoom(Math.min(200, zoom + 10))}
          >
            <ZoomInIcon />
            Zoom in
          </MenuItem>
          <MenuItem
            closeOnSelect={false}
            disabled={zoom <= 50}
            onSelect={() => setZoom(Math.max(50, zoom - 10))}
          >
            <ZoomOutIcon />
            Zoom out
          </MenuItem>
          <MenuItem onSelect={() => setZoom(100)}>Reset to 100%</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem value="fit" checked={fit} onCheckedChange={setFit} closeOnSelect>
          <MonitorIcon />
          Fit to window
          <CheckIcon aria-hidden="true" />
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>
  )
}

export { Example }
