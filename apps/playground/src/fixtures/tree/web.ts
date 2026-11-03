import { describeTree, treeFixture, type TreeFixtureItem } from "tests/fixtures/tree.ts"
import { treeOptions } from "tests/fixtures/page.ts"

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")

function items(list: TreeFixtureItem[], checkable: boolean): string {
  return list
    .map(
      (item) => `
        <ui-tree-item class="tree-item" value="${item.value}"${item.disabled ? " disabled" : ""}>${
          item.children ? `<ui-tree-item-indicator class="tree-indicator">▸</ui-tree-item-indicator>` : ""
        }${checkable ? `<ui-tree-item-checkbox class="tree-checkbox"></ui-tree-item-checkbox>` : ""}<ui-tree-item-label class="tree-label">${escape(item.label)}</ui-tree-item-label>${
          item.children
            ? `<ui-tree-group class="tree-group">${items(item.children, checkable)}</ui-tree-group>`
            : ""
        }</ui-tree-item>`,
    )
    .join("")
}

type TreeElement = HTMLElement & {
  api?: {
    expandAll: () => void
    collapseAll: () => void
    reveal: (value: string) => void
    isExpanded: (value: string) => boolean
  }
}

function markup(content: string) {
  return `
    <div class="fixture">
      <button>Before</button>
      <ui-tree class="tree" aria-label="${treeFixture.label}">${content}</ui-tree>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <button data-call="expandAll">Expand all</button>
      <button data-call="collapseAll">Collapse all</button>
      <button data-call="reveal">Reveal dialog</button>
    </div>
  `
}

// Sets the URL options as attributes and wires the status region and the controller buttons.
async function setUp(root: HTMLElement) {
  const { cancel, ...options } = treeOptions()
  const tree = root.querySelector<TreeElement>("ui-tree")!
  const attributes: Record<string, string | boolean | undefined> = {
    mode: options.mode,
    "default-value": Array.isArray(options.defaultValue)
      ? options.defaultValue.join(",")
      : (options.defaultValue ?? undefined),
    "default-expanded": options.defaultExpanded.join(",") || undefined,
    checkable: options.checkable,
    "check-strategy": options.checkStrategy,
    current: options.current,
    activation: options.activation,
    disabled: options.disabled,
    "keep-mounted": options.keepMounted,
    "hidden-until-found": options.hiddenUntilFound,
  }
  for (const [name, value] of Object.entries(attributes))
    if (value === true) tree.setAttribute(name, "")
    else if (value) tree.setAttribute(name, value)
  const status = root.querySelector("output")!
  const report = (kind: string) => (event: Event) => {
    const value = (event as CustomEvent<{ value: string | string[] | null }>).detail.value
    if (
      kind === "expanded" &&
      cancel &&
      (value as string[]).includes(cancel) &&
      !tree.api?.isExpanded(cancel)
    )
      return event.preventDefault()
    status.textContent = describeTree(kind, value)
  }
  tree.addEventListener("valuechange", report("selected"))
  tree.addEventListener("expandedchange", report("expanded"))
  tree.addEventListener("checkedchange", report("checked"))
  tree.addEventListener("action", report("action"))
  for (const button of root.querySelectorAll<HTMLElement>("[data-call]"))
    button.addEventListener("click", () => {
      const call = button.dataset.call!
      if (call === "reveal") tree.api?.reveal("dialog.tsx")
      else tree.api?.[call as "expandAll" | "collapseAll"]()
    })
  await import("@ui-sdk/web/tree")
  return tree
}

async function mount(root: HTMLElement) {
  const { checkable } = treeOptions()
  root.innerHTML = markup(items(treeFixture.items, checkable))
  await setUp(root)
}

export { markup, mount, setUp }
