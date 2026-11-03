"use client"

import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"
import * as React from "react"

function Example() {
  const [vertical, setVertical] = React.useState(false)

  return (
    <div data-slot="stack">
      <Tabs defaultValue="music" orientation={vertical ? "vertical" : "horizontal"}>
        <TabsList aria-label="Library">
          <TabsTab value="music">Music</TabsTab>
          <TabsTab value="podcasts">Podcasts</TabsTab>
          <TabsTab value="audiobooks">Audiobooks</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value="music">312 songs, 24 albums.</TabsPanel>
        <TabsPanel value="podcasts">8 shows, 3 new episodes.</TabsPanel>
        <TabsPanel value="audiobooks">2 books in progress.</TabsPanel>
      </Tabs>
      <label data-slot="label">
        <input type="checkbox" checked={vertical} onChange={(event) => setVertical(event.target.checked)} />
        Vertical
      </label>
    </div>
  )
}

export { Example }
