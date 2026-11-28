import type { MenuData } from "@ui-sdk/core/menu"
import {
  menuFixture,
  type MenuFixtureItem,
} from "../../../../../tests/fixtures/menu.ts"

// The shared fixture as a data menu.
function convert(items: MenuFixtureItem[]): MenuData {
  return items.map((item) => {
    switch (item.type) {
      case "group":
        return { ...item, items: convert(item.items) }
      case "submenu":
        return { ...item, items: convert(item.items) }
      case "radio-group":
        return { ...item, name: item.label.toLowerCase().replace(/\W+/g, "-") }
      default:
        return item
    }
  })
}

const menuData = convert(menuFixture.items)

export { menuData }
