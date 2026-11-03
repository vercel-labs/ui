import * as React from "react"
import { createTreeCollection, definePrimitive } from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

const files = createTreeCollection([
  { key: "src", parent: null },
  { key: "src/lib", parent: "src" },
  { key: "src/lib/date.ts", parent: "src/lib" },
  { key: "src/lib/math.ts", parent: "src/lib" },
  { key: "src/index.ts", parent: "src" },
  { key: "docs", parent: null },
  { key: "docs/intro.md", parent: "docs" },
  { key: "README.md", parent: null },
])

type FilesState = { expanded: string[]; picked: string | null }

const fileList = definePrimitive({
  name: "file-list",
  state: (): FilesState => ({ expanded: ["src"], picked: null }),
  api: (context) => {
    const { store } = context
    return {
      toggle(key: string) {
        const { expanded } = store.get()
        if (!files.isBranch(key)) return store.set({ picked: key })
        store.set({
          expanded: expanded.includes(key) ? expanded.filter((other) => other !== key) : [...expanded, key],
        })
      },
      expandAll: () => store.set({ expanded: files.keys().filter((key) => files.isBranch(key)) }),
    }
  },
  slots: (slot) => ({
    root: slot<{}, { shown: readonly string[]; picked: string | null }>({
      state: (state) => ({ shown: files.visible(state.expanded), picked: state.picked }),
    }),
    row: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, { key }) => ({
        type: "button",
        "aria-expanded": files.isBranch(key) ? String(state.expanded.includes(key)) : undefined,
        "aria-current": state.picked === key ? "true" : undefined,
        style: `padding-inline-start:${(files.level(key) - 1) * 16 + 8}px`,
      }),
      press: ({ api, key }) => api.toggle(key),
    }),
    expand: slot({ attrs: () => ({ type: "button" }), press: ({ api }) => api.expandAll() }),
  }),
})

const parts = createParts(fileList, { root: "div", row: "button", expand: "button" })

const FileList = parts.Root

const FileRow = parts.Row

const FileExpandAll = parts.Expand

const name = (key: string) => key.split("/").at(-1)

function Example() {
  return (
    <FileList>
      {({ shown, picked }) => (
        <>
          <p data-path data-slot="hint">
            {picked ? [...files.ancestors(picked), picked].map(name).join(" / ") : "Pick a file"}
          </p>
          <div data-slot="tree-behavior-list">
            {shown.map((key) => (
              <FileRow key={key} value={key}>
                <span>
                  {files.isBranch(key) ? "📁 " : ""}
                  {name(key)}
                </span>
                {files.isBranch(key) && (
                  <span data-slot="hint">
                    {files.descendants(key).filter((below) => !files.isBranch(below)).length} files
                  </span>
                )}
              </FileRow>
            ))}
          </div>
          <p data-slot="hint">
            {files.children(null).length} at the top · <FileExpandAll>Expand all</FileExpandAll>
          </p>
        </>
      )}
    </FileList>
  )
}

export { Example, fileList, FileExpandAll, FileList, FileRow, type FilesState }
