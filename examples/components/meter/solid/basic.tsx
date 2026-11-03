import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "@ui-sdk/solid/meter"

export function Example() {
  return (
    <Meter value={68}>
      <MeterLabel>Storage used</MeterLabel>
      <MeterValue />
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  )
}
