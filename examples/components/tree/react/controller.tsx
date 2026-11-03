"use client"

import {
  createTreeController,
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/react/tree"
import { ChevronRightIcon } from "lucide-react"
import * as React from "react"

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

function Items({ items }: { items: Node[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value}>
      <TreeItemLabel>
        {item.children ? (
          <TreeItemIndicator>
            <ChevronRightIcon aria-hidden="true" />
          </TreeItemIndicator>
        ) : (
          <span />
        )}
        {item.label}
      </TreeItemLabel>
      {item.children && (
        <TreeGroup>
          <Items items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function Example() {
  const [settings] = React.useState(() => createTreeController())
  const [expanded, setExpanded] = React.useState<string[]>([])
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
        expanded={expanded}
        onExpandedChange={setExpanded}
      >
        <Items items={sections} />
      </Tree>
      <p data-slot="hint">Expanded: {expanded.join(", ") || "none"}</p>
    </div>
  )
}

export { Example }
