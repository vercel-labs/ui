import { Button } from "@ui-sdk/react/button"

const actions = ["Archive", "Report", "Snooze"]

export function Example() {
  return (
    <div data-slot="row" role="group" aria-label="Message actions">
      {actions.map((action) => (
        <Button key={action}>{action}</Button>
      ))}
    </div>
  )
}
