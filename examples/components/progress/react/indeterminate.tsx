import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack } from "@ui-sdk/react/progress"

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
