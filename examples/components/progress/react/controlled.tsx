import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/react/progress"
import * as React from "react"

export function Example() {
  const [value, setValue] = React.useState(20)

  return (
    <div data-slot="stack">
      <Progress value={value}>
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <div data-slot="row">
        <button
          data-variant="secondary"
          type="button"
          aria-disabled={value >= 100}
          onClick={() => setValue((current) => Math.min(100, current + 20))}
        >
          Upload more
        </button>
        <button data-variant="secondary" type="button" onClick={() => setValue(0)}>
          Reset
        </button>
      </div>
    </div>
  )
}
