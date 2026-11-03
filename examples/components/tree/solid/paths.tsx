import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  treeFromPaths,
} from "@ui-sdk/solid/tree"
import type { TreeItemData } from "@ui-sdk/solid/tree"
import { createSignal, For, Show } from "solid-js"

const paths = [
  "src/index.ts",
  "src/lib/format.ts",
  "src/lib/parse.ts",
  "src/routes/home.tsx",
  "src/routes/about.tsx",
  "tests/",
  "package.json",
  "tsconfig.json",
]

const items = treeFromPaths(paths)
const files = new Set(paths.filter((path) => !path.endsWith("/")))

function Items(props: { items: TreeItemData[] }) {
  return (
    <For each={props.items}>
      {(item) => (
        <TreeItem value={item.value} branch={item.children !== undefined}>
          <TreeItemLabel>
            {(state) => (
              <>
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
                <span>{item.label}</span>
                <Show when={state.pending}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </Show>
              </>
            )}
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
  const [selected, setSelected] = createSignal<string | null>("src/index.ts")
  const [opened, setOpened] = createSignal<string | null>(null)
  return (
    <div data-slot="stack">
      <Tree
        aria-label="Project"
        paths={paths}
        defaultExpanded={["src"]}
        value={selected()}
        onValueChange={setSelected}
        activation="automatic"
        onAction={async (value) => {
          if (!files.has(value)) return
          await new Promise((resolve) => setTimeout(resolve, 600))
          setOpened(value)
        }}
      >
        <Items items={items} />
      </Tree>
      <div data-slot="stack">
        <span data-slot="hint">{selected() ?? "Nothing selected"}</span>
        <span>{opened() ? `Opened ${opened()}` : "Press Enter to open a file."}</span>
      </div>
    </div>
  )
}

export { Example }
