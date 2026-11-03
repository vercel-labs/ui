import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "@ui-sdk/solid/meter"

export function Example() {
  return (
    <Meter value={42}>
      <MeterLabel>Battery</MeterLabel>
      <MeterValue />
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  )
}
