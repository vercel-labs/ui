"use client"

import { Toolbar, ToolbarButton } from "@ui-sdk/react/toolbar"

function Example() {
  return (
    <Toolbar loop={false} aria-label="Pages">
      {["First", "Previous", "Next", "Last"].map((label) => (
        <ToolbarButton data-variant="secondary" key={label}>
          {label}
        </ToolbarButton>
      ))}
    </Toolbar>
  )
}

export { Example }
