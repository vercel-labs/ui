import * as React from "react"
import { formatDate, todayDate } from "@ui-sdk/core/date"

const zones = [
  ["Pacific/Auckland", "Auckland"],
  ["Asia/Tokyo", "Tokyo"],
  ["Europe/London", "London"],
  ["America/Los_Angeles", "Los Angeles"],
]

function Example() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <dl>
      {zones.map(([zone, city]) => (
        <React.Fragment key={zone}>
          <dt>{city}</dt>
          <dd data-zone={zone}>
            {mounted ? formatDate(todayDate(zone), "en-US", { dateStyle: "medium" }) : ""}
          </dd>
        </React.Fragment>
      ))}
      <dt>Here</dt>
      <dd data-zone="here">{mounted ? todayDate() : ""}</dd>
    </dl>
  )
}

export { Example }
