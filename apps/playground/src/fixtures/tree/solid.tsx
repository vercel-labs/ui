import {
  createTreeController,
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/solid/tree"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  describeTree,
  treeFixture,
  type TreeFixtureItem,
} from "tests/fixtures/tree.ts"
import { treeOptions } from "tests/fixtures/page.ts"

const controller = createTreeController()

function Items(props: { items: TreeFixtureItem[]; checkable: boolean }) {
  return (
    <For each={props.items}>
      {(item) => (
        <TreeItem class="tree-item" value={item.value} disabled={item.disabled}>
          <Show when={item.children}>
            <TreeItemIndicator class="tree-indicator">▸</TreeItemIndicator>
          </Show>
          <Show when={props.checkable}>
            <TreeItemCheckbox class="tree-checkbox" />
          </Show>
          <TreeItemLabel
            class="tree-label"
            render={
              item.href
                ? (label) => <a {...label} href={item.href} />
                : undefined
            }
          >
            {item.label}
          </TreeItemLabel>
          <Show when={item.children}>
            {(children) => (
              <TreeGroup class="tree-group">
                <Items items={children()} checkable={props.checkable} />
              </TreeGroup>
            )}
          </Show>
        </TreeItem>
      )}
    </For>
  )
}

// With `data`, the tree also gets its items as data, which give it its whole shape: typeahead
// and the controller reach items in collapsed branches.
function Fixture(props: { data?: boolean }) {
  const [action, setAction] = createSignal("")
  const { cancel, ...options } = treeOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <Tree
        class="tree"
        aria-label={treeFixture.label}
        items={props.data ? treeFixture.items : undefined}
        controller={controller}
        {...options}
        onValueChange={(value) => setAction(describeTree("selected", value))}
        onExpandedChange={(expanded, details) => {
          if (
            cancel &&
            expanded.includes(cancel) &&
            !controller.isExpanded(cancel)
          ) {
            return details.cancel()
          }
          setAction(describeTree("expanded", expanded))
        }}
        onCheckedChange={(checked) =>
          setAction(describeTree("checked", checked))
        }
        onAction={(value) => {
          setAction(describeTree("action", value))
        }}
      >
        <Items items={treeFixture.items} checkable={options.checkable} />
      </Tree>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.expandAll()}>Expand all</button>
      <button onClick={() => controller.collapseAll()}>Collapse all</button>
      <button onClick={() => controller.reveal("dialog.tsx")}>
        Reveal dialog
      </button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, Items, mount }
