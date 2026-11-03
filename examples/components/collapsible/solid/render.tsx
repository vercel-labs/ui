import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible"

function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger
        data-variant="secondary"
        render={(props, state) => (
          <h3>
            <button {...props} />
            <span data-slot="hint">{state.open ? "3 updates" : "Arrives Thursday"}</span>
          </h3>
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span>Track parcel</span>
      </CollapsibleTrigger>
      <CollapsiblePanel render={(props) => <ol {...props} />}>
        <li data-slot="row">
          Out for delivery <span>07:40</span>
        </li>
        <li data-slot="row">
          Arrived at the local depot <span>05:12</span>
        </li>
        <li data-slot="row">
          Left the sorting center <span>Wed 21:03</span>
        </li>
      </CollapsiblePanel>
    </Collapsible>
  )
}

export { Example }
