import {
  iconMarkup,
  iconsFixture as f,
  iconsOptions,
  type IconName,
} from "tests/fixtures/item-icons.ts"

type Entry = {
  value: string
  label: string
  icon?: IconName
  emoji?: string
  mirror?: boolean
}

// An entry's icon part, holding its SVG or its emoji, or nothing without one.
function icon(
  tag: string,
  entry: { icon?: IconName; emoji?: string; mirror?: boolean }
) {
  const glyph = entry.icon ? iconMarkup(entry.icon) : entry.emoji
  return glyph
    ? `<${tag}${entry.mirror ? " mirror" : ""}>${glyph}</${tag}>`
    : ""
}

const each = (entries: Entry[], render: (entry: Entry) => string) =>
  entries.map(render).join("")

function markup(unnamed: boolean) {
  return `
    <div class="fixture icons-fixture">
      <button>Before</button>

      <ui-menu>
        <ui-menu-trigger><button class="trigger">${f.menu.trigger}</button></ui-menu-trigger>
        <ui-menu-content class="popup">
          ${each(f.menu.items, (item) => `<ui-menu-item value="${item.value}">${icon("ui-menu-item-icon", item)}${item.label}</ui-menu-item>`)}
          <ui-menu-item value="${f.menu.iconOnly.value}" aria-label="${f.menu.iconOnly.label}">${icon("ui-menu-item-icon", f.menu.iconOnly)}</ui-menu-item>
          ${unnamed ? `<ui-menu-item value="${f.unnamed.value}">${icon("ui-menu-item-icon", f.unnamed)}</ui-menu-item>` : ""}
        </ui-menu-content>
      </ui-menu>

      <ui-select placeholder="${f.select.placeholder}">
        <ui-select-label class="label">${f.select.label}</ui-select-label>
        <ui-select-trigger><button class="trigger"><ui-select-value-icon class="value-icon"></ui-select-value-icon><ui-select-value class="value"></ui-select-value></button></ui-select-trigger>
        <ui-select-content class="popup list-popup">
          ${each(f.select.items, (item) => `<ui-select-item class="item" value="${item.value}">${icon("ui-select-item-icon", item)}${item.label}</ui-select-item>`)}
        </ui-select-content>
      </ui-select>

      <ui-combobox>
        <ui-combobox-label class="label">${f.combobox.label}</ui-combobox-label>
        <ui-combobox-value-icon class="value-icon"></ui-combobox-value-icon>
        <ui-combobox-input><input class="input" /></ui-combobox-input>
        <ui-combobox-content class="popup list-popup">
          <ui-combobox-list>
            ${each(f.combobox.items, (item) => `<ui-combobox-item class="item" value="${item.value}">${icon("ui-combobox-item-icon", item)}<ui-combobox-item-text>${item.label}</ui-combobox-item-text></ui-combobox-item>`)}
          </ui-combobox-list>
        </ui-combobox-content>
      </ui-combobox>

      <ui-autocomplete>
        <ui-autocomplete-label class="label">${f.autocomplete.label}</ui-autocomplete-label>
        <ui-autocomplete-input><input class="input" /></ui-autocomplete-input>
        <ui-autocomplete-content class="popup list-popup">
          <ui-autocomplete-empty class="empty">No results</ui-autocomplete-empty>
          <ui-autocomplete-list>
            ${each(
              f.autocomplete.items,
              (
                item
              ) => `<ui-autocomplete-item class="item" value="${item.label}">
              ${icon("ui-autocomplete-item-icon", item)}
              <ui-autocomplete-item-text>${item.label}</ui-autocomplete-item-text>
            </ui-autocomplete-item>`
            )}
          </ui-autocomplete-list>
        </ui-autocomplete-content>
      </ui-autocomplete>

      <ui-command class="command">
        <ui-command-input><input class="input" aria-label="${f.command.label}" /></ui-command-input>
        <ui-command-empty class="empty">No results</ui-command-empty>
        <ui-command-list class="command-list">
          ${each(f.command.items, (item) => `<ui-command-item class="item" value="${item.value}">${icon("ui-command-item-icon", item)}<ui-command-item-text>${item.label}</ui-command-item-text></ui-command-item>`)}
        </ui-command-list>
      </ui-command>

      <ui-tabs class="tabs">
        <ui-tabs-list class="tablist" aria-label="${f.tabs.label}">
          ${each(f.tabs.tabs, (tab) => `<ui-tabs-tab value="${tab.value}"><button class="tab">${icon("ui-tabs-tab-icon", tab)}${tab.label}</button></ui-tabs-tab>`)}
          <ui-tabs-tab value="${f.tabs.iconOnly.value}"><button class="tab" aria-label="${f.tabs.iconOnly.label}">${icon("ui-tabs-tab-icon", f.tabs.iconOnly)}</button></ui-tabs-tab>
        </ui-tabs-list>
      </ui-tabs>

      <ui-toggle-group class="toggle-group" aria-label="${f.toggles.label}">
        <ui-toggle value="${f.toggles.bold.value}"><button class="toggle">${icon("ui-toggle-icon", f.toggles.bold)}${f.toggles.bold.label}</button></ui-toggle>
        <ui-toggle value="${f.toggles.iconOnly.value}"><button class="toggle" aria-label="${f.toggles.iconOnly.label}">${icon("ui-toggle-icon", f.toggles.iconOnly)}</button></ui-toggle>
      </ui-toggle-group>

      <ui-navigation-menu class="nav-menu" aria-label="${f.navigation.label}">
        <ui-navigation-menu-list class="nav-list">
          ${each(f.navigation.links, (link) => `<ui-navigation-menu-item value="${link.value}"><ui-navigation-menu-link><a class="nav-link" href="#${link.value}">${icon("ui-navigation-menu-link-icon", link)}${link.label}</a></ui-navigation-menu-link></ui-navigation-menu-item>`)}
        </ui-navigation-menu-list>
      </ui-navigation-menu>

      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>`
}

async function mount(root: HTMLElement) {
  const options = iconsOptions()
  root.innerHTML = markup(options.unnamed)
  if (options.select) {
    root
      .querySelector("ui-select")!
      .setAttribute("default-value", options.select)
  }
  if (options.combobox) {
    root
      .querySelector("ui-combobox")!
      .setAttribute("default-value", options.combobox)
  }
  const output = root.querySelector("output")!
  const report = (name: string) => (event: Event) => {
    if (!(event.target as Element).localName.startsWith(`ui-${name}`)) {
      return
    }
    output.textContent = `${name}:${(event as CustomEvent<{ value: unknown }>).detail.value}`
  }
  root.querySelector("ui-menu")!.addEventListener("action", report("menu"))
  root
    .querySelector("ui-select")!
    .addEventListener("valuechange", report("select"))
  root
    .querySelector("ui-combobox")!
    .addEventListener("valuechange", report("combobox"))
  root
    .querySelector("ui-command")!
    .addEventListener("action", report("command"))
  await import("@ui-sdk/web/menu")
  await import("@ui-sdk/web/select")
  await import("@ui-sdk/web/combobox")
  await import("@ui-sdk/web/autocomplete")
  await import("@ui-sdk/web/command")
  await import("@ui-sdk/web/tabs")
  await import("@ui-sdk/web/toggle")
  await import("@ui-sdk/web/navigation-menu")
}

export { mount }
