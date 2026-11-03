import { Tree } from "@ui-sdk/solid/tree"
import { render } from "@solidjs/web"
import { createSignal, onCleanup } from "solid-js"
import { treeLinksFixture } from "tests/fixtures/tree.ts"
import { Items } from "../tree/solid"

// A tree of links, rendered with the tree fixture's classes. The current page follows the address.
function Fixture() {
  const [current, setCurrent] = createSignal(location.hash.slice(1) || "usage")
  const changed = () => setCurrent(location.hash.slice(1))
  window.addEventListener("hashchange", changed)
  onCleanup(() => window.removeEventListener("hashchange", changed))
  return (
    <div class="fixture">
      <button>Before</button>
      <Tree
        class="tree"
        aria-label={treeLinksFixture.label}
        items={treeLinksFixture.items}
        mode="none"
        current={current()}
      >
        <Items items={treeLinksFixture.items} checkable={false} />
      </Tree>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {current()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
