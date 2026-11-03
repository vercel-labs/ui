import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack } from "@ui-sdk/solid/progress"

export function Example() {
  return (
    <Progress value={null}>
      <ProgressLabel>Connecting</ProgressLabel>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  )
}
