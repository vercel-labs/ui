import { Tree } from "@ui-sdk/react/tree"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { treeLinksFixture } from "tests/fixtures/tree.ts"
import { Items } from "../tree/react"

// A tree of links, rendered with the tree fixture's classes. The current page follows the address.
function Fixture() {
  const [current, setCurrent] = React.useState(
    location.hash.slice(1) || "usage"
  )
  React.useEffect(() => {
    const changed = () => setCurrent(location.hash.slice(1))
    window.addEventListener("hashchange", changed)
    return () => window.removeEventListener("hashchange", changed)
  }, [])
  return (
    <div className="fixture">
      <button>Before</button>
      <Tree
        className="tree"
        aria-label={treeLinksFixture.label}
        items={treeLinksFixture.items}
        mode="none"
        current={current}
      >
        <Items items={treeLinksFixture.items} checkable={false} />
      </Tree>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {current}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { mount }
