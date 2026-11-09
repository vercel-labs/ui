import {
  navigationMenuAction,
  navigationMenuFixture as fixture,
  navigationMenuLayout,
  navigationMenuOptions,
} from "tests/fixtures/navigation-menu.ts"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

const links = (list: { label: string; href: string }[]) =>
  `<ul>${list
    .map(
      (link) =>
        `<li><ui-navigation-menu-link><a href="${link.href}">${link.label}</a></ui-navigation-menu-link></li>`
    )
    .join("")}</ul>`

function markup() {
  const layout = navigationMenuLayout()
  const vertical = navigationMenuOptions().orientation === "vertical"
  const kept = `${layout.keepMounted ? " keep-mounted" : ""}${layout.hiddenUntilFound ? " hidden-until-found" : ""}`
  const nested = fixture.nested
  const nestedMenu = `
    <ui-navigation-menu orientation="vertical">
      <ui-navigation-menu-list class="nav-list vertical">
        <ui-navigation-menu-item value="${nested.value}">
          <ui-navigation-menu-trigger><button class="nav-trigger">${nested.trigger}</button></ui-navigation-menu-trigger>
          <ui-navigation-menu-content class="nav-content narrow">${links(nested.links)}</ui-navigation-menu-content>
        </ui-navigation-menu-item>
      </ui-navigation-menu-list>
    </ui-navigation-menu>`
  const items = fixture.items
    .map(
      (item, index) => `
      <ui-navigation-menu-item value="${item.value}">
        <ui-navigation-menu-trigger><button class="nav-trigger">${item.trigger}</button></ui-navigation-menu-trigger>
        <ui-navigation-menu-content class="${index === 0 ? "nav-content" : "nav-content narrow"}"${kept}>
          ${links(item.links)}
          ${index === 1 && layout.nested ? nestedMenu : ""}
        </ui-navigation-menu-content>
      </ui-navigation-menu-item>`
    )
    .join("")
  return `
    <div class="fixture">
      <button>Before</button>
      <ui-navigation-menu aria-label="${fixture.label}" class="nav-menu">
        <ui-navigation-menu-list class="${vertical ? "nav-list vertical" : "nav-list"}">
          ${items}
          <ui-navigation-menu-item>
            <ui-navigation-menu-link current><a class="nav-link" href="${fixture.link.href}">${fixture.link.label}</a></ui-navigation-menu-link>
          </ui-navigation-menu-item>
        </ui-navigation-menu-list>
        <ui-navigation-menu-indicator class="nav-indicator"></ui-navigation-menu-indicator>
        ${layout.viewport ? `<ui-navigation-menu-viewport class="nav-viewport"></ui-navigation-menu-viewport>` : ""}
      </ui-navigation-menu>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
}

async function mount(root: HTMLElement) {
  const template = document.createElement("template")
  template.innerHTML = markup()
  const menu = template.content.querySelector("ui-navigation-menu")!
  // URL options go in as attributes, never as markup, so a crafted URL can't add elements.
  // The side and align place the outer menu's panels and viewport, not the nested menu's.
  const { placement } = navigationMenuLayout()
  for (const part of menu.querySelectorAll(
    "ui-navigation-menu-content, ui-navigation-menu-viewport"
  )) {
    if (part.closest("ui-navigation-menu") === menu) {
      for (const [name, value] of Object.entries(placement)) {
        part.setAttribute(name, value)
      }
    }
  }
  for (const [name, value] of Object.entries(navigationMenuOptions())) {
    if (name === "container") {
      menu.setAttribute("container", `#${(value as HTMLElement).id}`)
    } else if (value === true) {
      menu.setAttribute(kebab(name), "")
    } else {
      menu.setAttribute(kebab(name), String(value))
    }
  }
  root.replaceChildren(template.content)
  await import("@ui-sdk/web/navigation-menu")
  menu.addEventListener("valuechange", (event) => {
    const { value, reason } = (
      event as CustomEvent<{ value: string | null; reason: string }>
    ).detail
    root.querySelector("output")!.textContent = navigationMenuAction(
      value,
      reason
    )
  })
}

export { mount }
