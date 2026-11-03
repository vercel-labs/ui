import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/solid/tree"
import { createSignal, For, Show } from "solid-js"

const items: TreeItemData[] = [
  {
    value: "plans",
    label: "Plans",
    children: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
      { value: "enterprise", label: "Enterprise", disabled: true },
    ],
  },
  {
    value: "legacy",
    label: "Legacy plans",
    disabled: true,
    children: [{ value: "starter", label: "Starter" }],
  },
  { value: "custom", label: "Custom" },
]

function Items(props: { items: TreeItemData[] }) {
  return (
    <For each={props.items}>
      {(item) => (
        <TreeItem value={item.value} branch={item.children !== undefined} disabled={item.disabled}>
          <Show when={item.children}>
            <TreeItemIndicator />
          </Show>
          <TreeItemLabel>{item.label}</TreeItemLabel>
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
  const [focusable, setFocusable] = createSignal(true)
  return (
    <div data-slot="stack">
      <Tree aria-label="Plans" items={items} defaultExpanded={["plans"]} focusableWhenDisabled={focusable()}>
        <Items items={items} />
      </Tree>
      <label data-slot="label">
        <Switch checked={focusable()} onCheckedChange={setFocusable}>
          <SwitchThumb />
        </Switch>
        Focusable when disabled
      </label>
    </div>
  )
}

export { Example }
