"use client"

import * as React from "react"
import { Button } from "@ui-sdk/react/button"

function Example() {
  const [title, setTitle] = React.useState("")
  const [published, setPublished] = React.useState(false)
  const hint = React.useId()
  const ready = title.trim() !== ""

  return (
    <div data-slot="stack">
      <label data-slot="label">
        Title
        <input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            setPublished(false)
          }}
        />
      </label>
      <div data-slot="row">
        <Button
          disabled={!ready}
          focusableWhenDisabled
          aria-describedby={hint}
          onClick={() => setPublished(true)}
        >
          Publish
        </Button>
        <p id={hint}>{!ready ? "Add a title to publish." : published ? "Published." : "Ready to publish."}</p>
      </div>
    </div>
  )
}

export { Example }
