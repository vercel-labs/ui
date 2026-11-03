"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/react/toolbar"
import { CheckIcon, ChevronsUpDownIcon, MonitorIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react"
import * as React from "react"

const zooms = ["50%", "75%", "100%", "150%", "200%"]

function Example() {
  const [zoom, setZoom] = React.useState("100%")
  const index = zooms.indexOf(zoom)
  return (
    <Toolbar aria-label="View">
      <ToolbarButton
        data-variant="secondary"
        aria-label="Zoom out"
        disabled={index === 0}
        onClick={() => setZoom(zooms[index - 1])}
      >
        <ZoomOutIcon />
      </ToolbarButton>
      <Select value={zoom} onValueChange={(value) => value && setZoom(value)}>
        <ToolbarButton data-variant="secondary" render={<SelectTrigger />} aria-label="Zoom">
          <SelectValue />
          <ChevronsUpDownIcon />
        </ToolbarButton>
        <SelectContent>
          {zooms.map((zoom) => (
            <SelectItem key={zoom} value={zoom}>
              {zoom}
              <SelectItemIndicator>
                <CheckIcon />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ToolbarButton
        data-variant="secondary"
        aria-label="Zoom in"
        disabled={index === zooms.length - 1}
        onClick={() => setZoom(zooms[index + 1])}
      >
        <ZoomInIcon />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton data-variant="secondary" aria-label="Fit to screen" onClick={() => setZoom("100%")}>
        <MonitorIcon />
      </ToolbarButton>
    </Toolbar>
  )
}

export { Example }
