import { treeLinksFixture } from "tests/fixtures/tree.ts"

// A tree of links, its items copies of the parts in its <template>. The current page follows the address.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-tree class="tree" aria-label="${treeLinksFixture.label}" mode="none">
        <template>
          <ui-tree-item class="tree-item">
            <ui-tree-item-indicator class="tree-indicator">▸</ui-tree-item-indicator>
            <ui-tree-item-label class="tree-label"></ui-tree-item-label>
            <ui-tree-group class="tree-group"></ui-tree-group>
          </ui-tree-item>
        </template>
      </ui-tree>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  const tree = root.querySelector<HTMLElement & { items?: unknown }>("ui-tree")!
  const status = root.querySelector("output")!
  const follow = () => {
    const current = location.hash.slice(1) || "usage"
    tree.setAttribute("current", current)
    status.textContent = current
  }
  follow()
  window.addEventListener("hashchange", follow)
  await import("@ui-sdk/web/tree")
  tree.items = treeLinksFixture.items
}

export { mount }
