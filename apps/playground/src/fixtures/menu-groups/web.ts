import { onItemsChange } from "tests/fixtures/items.ts"
import { changedMenuGroups, menuGroups } from "tests/fixtures/menu-groups.ts"

// Groups of items the specs reorder while the menu is open. A reorder moves
// the group elements, as a framework moves keyed ones.
async function mount(root: HTMLElement) {
  const groups = menuGroups
    .map(
      (group) => `
        <ui-menu-group data-label="${group.label}">
          <ui-menu-group-label class="label">${group.label}</ui-menu-group-label>
          ${group.items.map((item) => `<ui-menu-item class="item" value="${item.value}">${item.label}</ui-menu-item>`).join("")}
        </ui-menu-group>`
    )
    .join("")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-menu>
        <ui-menu-trigger><button>Actions</button></ui-menu-trigger>
        <ui-menu-content class="popup">${groups}</ui-menu-content>
      </ui-menu>
    </div>
  `
  const content = root.querySelector("ui-menu-content")!
  onItemsChange(changedMenuGroups, (next) => {
    for (const group of next) {
      content.append(content.querySelector(`[data-label="${group.label}"]`)!)
    }
  })
  await import("@ui-sdk/web/menu")
}

export { mount }
