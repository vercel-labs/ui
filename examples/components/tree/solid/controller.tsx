import {
  createTreeController,
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/solid/tree"
import { createSignal, For, Show } from "solid-js"

type Node = { value: string; label: string; children?: Node[] }

const sections: Node[] = [
  {
    value: "account",
    label: "Account",
    children: [
      { value: "profile", label: "Profile" },
      {
        value: "security",
        label: "Security",
        children: [
          { value: "password", label: "Password" },
          { value: "two-factor", label: "Two-factor authentication" },
        ],
      },
    ],
  },
  {
    value: "workspace",
    label: "Workspace",
    children: [
      { value: "members", label: "Members" },
      { value: "billing", label: "Billing" },
    ],
  },
]

function Items(props: { items: Node[] }) {
  return (
    <For each={props.items}>
      {(item) => (
        <TreeItem value={item.value} branch={item.children !== undefined}>
          <TreeItemLabel>
            <Show when={item.children} fallback={<span />}>
              <TreeItemIndicator>
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
              </TreeItemIndicator>
            </Show>
            {item.label}
          </TreeItemLabel>
          <Show when={item.children}>
            {(children) => (
              <TreeGroup>
                <Items items={children()} />
              </TreeGroup>
            )}
          </Show>
        </TreeItem>
      )}
    </For>
  )
}

function Example() {
  const settings = createTreeController()
  const [expanded, setExpanded] = createSignal<string[]>([])
  return (
    <div data-slot="stack">
      <div data-slot="row">
        <button type="button" onClick={() => settings.expandAll()}>
          Expand all
        </button>
        <button type="button" onClick={() => settings.collapseAll()}>
          Collapse all
        </button>
        <button type="button" onClick={() => settings.reveal("two-factor")}>
          Find two-factor
        </button>
      </div>
      <Tree
        aria-label="Settings"
        controller={settings}
        keepMounted
        expanded={expanded()}
        onExpandedChange={setExpanded}
      >
        <Items items={sections} />
      </Tree>
      <p data-slot="hint">Expanded: {expanded().join(", ") || "none"}</p>
    </div>
  )
}

export { Example }
