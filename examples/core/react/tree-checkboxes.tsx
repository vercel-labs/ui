import * as React from "react"
import {
  createTreeCollection,
  definePrimitive,
  toggleTreeChecked,
  treeCheckedStates,
  treeDataNodes,
  type TreeCheckStrategy,
  type TreeItemData,
} from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type CheckTreeOptions = {
  items: TreeItemData[]
  strategy: TreeCheckStrategy
}

type CheckTreeState = { checked: string[]; strategy: TreeCheckStrategy }

type CheckTreeItemState = { checked: boolean | "indeterminate"; level: number }

const checkTree = definePrimitive({
  name: "check-tree",
  options: { items: "value", strategy: "string" },
  state: (options: CheckTreeOptions): CheckTreeState => ({ checked: [], strategy: options.strategy }),
  sync: (options) => ({ strategy: options.strategy }),
  api: (context) => {
    const { store } = context
    let cache: { items: TreeItemData[]; tree: ReturnType<typeof createTreeCollection> } | undefined
    const tree = () => {
      const { items } = context.options()
      if (cache?.items !== items) cache = { items, tree: createTreeCollection(treeDataNodes(items)) }
      return cache.tree
    }
    let states: {
      checked: string[]
      strategy: TreeCheckStrategy
      read: (key: string) => boolean | "indeterminate"
    }
    const stateOf = (state: CheckTreeState, key: string) => {
      if (states?.checked !== state.checked || states.strategy !== state.strategy)
        states = { ...state, read: treeCheckedStates(tree(), state.checked, state.strategy) }
      return states.read(key)
    }
    return {
      tree,
      stateOf,
      toggle(key: string) {
        const { checked, strategy } = store.get()
        store.set({ checked: toggleTreeChecked(tree(), checked, key, { strategy }) })
      },
    }
  },
  slots: (slot) => ({
    root: slot<{}, { checked: string[] }>({
      state: (state) => ({ checked: state.checked }),
      attrs: () => ({ role: "group" }),
    }),
    item: slot<{ value: string }, CheckTreeItemState>({
      props: { value: "string" },
      state: (state, { api, key }) => ({ checked: api.stateOf(state, key), level: api.tree().level(key) }),
      attrs: (state, { api, key }) => {
        const checked = api.stateOf(state, key)
        return {
          type: "button",
          role: "checkbox",
          "aria-checked": checked === "indeterminate" ? "mixed" : String(checked),
          "data-checked": checked === true ? "" : undefined,
          "data-indeterminate": checked === "indeterminate" ? "" : undefined,
          style: `padding-inline-start:${(api.tree().level(key) - 1) * 20}px`,
        }
      },
      press: ({ api, key }) => api.toggle(key),
    }),
  }),
})

const parts = createParts(checkTree, { root: "div", item: "button" })

const CheckTree = parts.Root

const CheckTreeItem = parts.Item

const items: TreeItemData[] = [
  {
    value: "src",
    label: "src",
    children: [
      { value: "src/index.ts", label: "index.ts" },
      { value: "src/util.ts", label: "util.ts" },
    ],
  },
  { value: "README.md", label: "README.md" },
]

const flat = (list: TreeItemData[]): TreeItemData[] =>
  list.flatMap((item) => [item, ...flat(item.children ?? [])])

function Example() {
  const [strategy, setStrategy] = React.useState<TreeCheckStrategy>("leaf")
  return (
    <div data-slot="stack">
      <div role="radiogroup" aria-label="Strategy" data-slot="check-tree-strategy">
        {(["leaf", "trunk"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={strategy === option}
            data-size="sm"
            onClick={() => setStrategy(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <CheckTree items={items} strategy={strategy} aria-label="Files">
        {({ checked }) => (
          <>
            {flat(items).map((item) => (
              <CheckTreeItem key={item.value} value={item.value} aria-label={item.label}>
                <span data-slot="check-tree-box">
                  <span data-show="checked">✓</span>
                  <span data-show="indeterminate">–</span>
                </span>
                {item.label}
              </CheckTreeItem>
            ))}
            <p data-slot="output" data-value>
              Value: {checked.length ? checked.join(", ") : "none"}
            </p>
          </>
        )}
      </CheckTree>
    </div>
  )
}

export {
  checkTree,
  CheckTree,
  CheckTreeItem,
  Example,
  type CheckTreeItemState,
  type CheckTreeOptions,
  type CheckTreeState,
}
