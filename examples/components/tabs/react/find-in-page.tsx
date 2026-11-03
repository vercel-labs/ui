"use client"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"

const policies = [
  {
    value: "shipping",
    label: "Shipping",
    text: "Orders leave our warehouse within two working days. Express delivery arrives the next morning.",
  },
  {
    value: "returns",
    label: "Returns",
    text: "Send anything back within 30 days. Opened electronics carry a restocking fee of 10 percent.",
  },
  {
    value: "warranty",
    label: "Warranty",
    text: "Every product has a two year warranty. Batteries are covered for one year.",
  },
]

function Example() {
  return (
    <Tabs defaultValue="shipping" hiddenUntilFound>
      <TabsList aria-label="Policies">
        {policies.map((policy) => (
          <TabsTab key={policy.value} value={policy.value}>
            {policy.label}
          </TabsTab>
        ))}
      </TabsList>
      {policies.map((policy) => (
        <TabsPanel key={policy.value} value={policy.value}>
          <h3>{policy.label}</h3>
          <p data-slot="hint">{policy.text}</p>
        </TabsPanel>
      ))}
    </Tabs>
  )
}

export { Example }
