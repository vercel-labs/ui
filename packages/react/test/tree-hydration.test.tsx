// @vitest-environment jsdom
import * as React from "react"
import { hydrateRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test, vi } from "vitest"
import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "../src/tree"

Element.prototype.getAnimations ??= () => []

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

// Longer than React's 5ms time slice, so hydration yields between a branch and its items.
function Slow() {
  const until = performance.now() + 10
  while (performance.now() < until) {}
  return null
}

test("an item hydrates at its depth when hydration yields inside its branch", async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  function App() {
    React.useEffect(resolve, [])
    return (
      <Tree aria-label="Files" defaultExpanded={["src", "components"]}>
        <TreeItem value="src">
          <TreeItemLabel>src</TreeItemLabel>
          <TreeGroup>
            <TreeItem value="components">
              <TreeItemLabel>components</TreeItemLabel>
              <TreeGroup>
                <Slow />
                <TreeItem value="button.tsx">
                  <TreeItemLabel>button.tsx</TreeItemLabel>
                </TreeItem>
              </TreeGroup>
            </TreeItem>
          </TreeGroup>
        </TreeItem>
      </Tree>
    )
  }
  const container = document.body.appendChild(document.createElement("div"))
  container.innerHTML = renderToString(<App />)
  const errors = vi.spyOn(console, "error").mockImplementation(() => {})
  React.startTransition(() => {
    root = hydrateRoot(container, <App />)
  })
  await promise
  expect(errors.mock.calls).toEqual([])
  expect(
    [...container.querySelectorAll('[role="treeitem"]')].map((item) =>
      item.getAttribute("aria-level")
    )
  ).toEqual(["1", "2", "3"])
})
