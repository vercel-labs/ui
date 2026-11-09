// The items every tree implementation renders. Labels, values and order are
// the contract the specs rely on, so change them here and nowhere else.
type TreeFixtureItem = {
  value: string
  label: string
  children?: TreeFixtureItem[]
  disabled?: boolean
  // A link's address. Its label renders as the link.
  href?: string
}

const treeFixture = {
  label: "Files",
  items: [
    {
      value: "src",
      label: "src",
      children: [
        {
          value: "components",
          label: "components",
          children: [
            { value: "button.tsx", label: "button.tsx" },
            { value: "dialog.tsx", label: "dialog.tsx" },
          ],
        },
        { value: "index.ts", label: "index.ts" },
        { value: "legacy.ts", label: "legacy.ts", disabled: true },
      ],
    },
    {
      value: "docs",
      label: "docs",
      children: [{ value: "intro.md", label: "intro.md" }],
    },
    { value: "package.json", label: "package.json" },
  ] satisfies TreeFixtureItem[] as TreeFixtureItem[],
}

// What the fixture's status region shows after a change, like "expanded src,docs".
function describeTree(kind: string, value: string | readonly string[] | null) {
  const shown =
    value === null
      ? "none"
      : typeof value === "string"
        ? value
        : value.length
          ? value.join(",")
          : "none"
  return `${kind} ${shown}`
}

// A tree of links, like a docs sidebar: no selection, and the current page marked.
const treeLinksFixture = {
  label: "Docs",
  items: [
    {
      value: "start",
      label: "Getting started",
      children: [
        { value: "installation", label: "Installation", href: "#installation" },
        { value: "usage", label: "Usage", href: "#usage" },
      ],
    },
    {
      value: "components",
      label: "Components",
      children: [{ value: "tree", label: "Tree", href: "#tree" }],
    },
  ],
}

export { describeTree, treeFixture, type TreeFixtureItem, treeLinksFixture }
