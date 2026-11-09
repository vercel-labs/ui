import "@ui-sdk/web/tree"
import { mountWhenAsked, perfSize } from "tests/fixtures/perf.ts"

// A tree of N folders of two files each, like a long file explorer, for the
// count gates. Every folder starts collapsed.
function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => {
    const file = (n: number, name: string) => `
      <ui-tree-item class="tree-item" value="folder-${n}/${name}"><ui-tree-item-label class="tree-label">File ${n}${name}</ui-tree-item-label></ui-tree-item>`
    const folders = Array.from(
      { length: perfSize(200) },
      (_, index) => `
        <ui-tree-item class="tree-item" value="folder-${index + 1}">
          <ui-tree-item-label class="tree-label">Folder ${index + 1}</ui-tree-item-label>
          <ui-tree-group class="tree-group">${file(index + 1, "a")}${file(index + 1, "b")}</ui-tree-group>
        </ui-tree-item>`
    ).join("")
    target.innerHTML = `
      <div class="fixture" style="flex-direction: column; align-items: start">
        <button>Before</button>
        <ui-tree class="tree" aria-label="Folders">${folders}</ui-tree>
        <button>After</button>
      </div>
    `
  })
}

export { mount }
