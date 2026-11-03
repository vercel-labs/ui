import "@ui-sdk/web/navigation-menu"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { hasViewport, href, items, moreLinks, nestedLinks, type Item, type Variant } from "./variants"

const kebab = (name: string) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

const attributes = (record: Record<string, unknown>) =>
  Object.entries(record)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => `${kebab(name)}="${value}"`)
    .join(" ")

const chevron = `<svg class="${classes.chevron}" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 4.5 6 7.5l3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>`

function link(variant: Variant, label: string, description?: string, closeOnSelect?: boolean) {
  return `
    <li>
      <ui-navigation-menu-link ${attributes({ closeOnSelect })}>
        <a class="${classes.link}" href="${href(variant, label)}">
          <span class="${classes.linkTitle}">${label}</span>
          ${description ? `<span class="${classes.linkDescription}">${description}</span>` : ""}
        </a>
      </ui-navigation-menu-link>
    </li>`
}

// A vertical menu inside the first panel, whose content is its own popup.
function nested(variant: Variant) {
  return `
    <ui-navigation-menu orientation="vertical" class="${classes.nestedRoot}">
      <ui-navigation-menu-list class="${classes.list}">
        <ui-navigation-menu-item value="learn">
          <ui-navigation-menu-trigger><button class="${classes.trigger}">Learn ${chevron}</button></ui-navigation-menu-trigger>
          <ui-navigation-menu-content class="${classes.nestedContent}">
            <ul class="${classes.links}">${nestedLinks.map((label) => link(variant, label)).join("")}</ul>
          </ui-navigation-menu-content>
        </ui-navigation-menu-item>
      </ui-navigation-menu-list>
    </ui-navigation-menu>`
}

function panel(variant: Variant, env: Env, item: Item) {
  const first = item.value === "products"
  const menuCloses = variant.options?.closeOnSelect ?? true
  const links =
    first && variant.body === "long"
      ? Array.from({ length: 30 }, (_, index) => ({ label: `Product ${index + 1}`, description: "" }))
      : item.links
  const props = attributes({
    ...variant.content,
    anchor: hasViewport(variant) ? undefined : env.anchor,
  })
  return `
    <ui-navigation-menu-content class="${classes.content(variant, item.value)}" ${props}>
      <ul class="${classes.links}">${links
        .map((entry, index) =>
          link(
            variant,
            entry.label,
            entry.description,
            variant.linkCloseOnSelect && index === 0 ? !menuCloses : undefined,
          ),
        )
        .join("")}</ul>
      ${first && variant.body === "dynamic" ? `<button class="${classes.more}" data-more>Show more</button>` : ""}
      ${first && variant.body === "nested" ? nested(variant) : ""}
    </ui-navigation-menu-content>`
}

function markup(variant: Variant, env: Env) {
  const root = attributes({
    ...variant.options,
    container: env.container && `#${env.container.id}`,
  })
  const viewport = attributes({ ...(variant.viewport || {}), anchor: env.anchor })
  return `
    <ui-navigation-menu id="${env.navId}" aria-label="Main ${variant.id}" class="${classes.root}" ${root}>
      <ui-navigation-menu-list class="${classes.list}">
        ${items
          .map(
            (item) => `
          <ui-navigation-menu-item value="${item.value}">
            <ui-navigation-menu-trigger ${variant.disabled === item.value ? "disabled" : ""}><button class="${classes.trigger}">${item.label} ${chevron}</button></ui-navigation-menu-trigger>
            ${panel(variant, env, item)}
          </ui-navigation-menu-item>`,
          )
          .join("")}
        <ui-navigation-menu-item>
          <ui-navigation-menu-link ${variant.activeLink !== false ? "current" : ""}><a class="${classes.topLink}" href="${href(variant, "pricing")}">Pricing</a></ui-navigation-menu-link>
        </ui-navigation-menu-item>
      </ui-navigation-menu-list>
      <ui-navigation-menu-indicator class="${classes.indicator}"></ui-navigation-menu-indicator>
      ${hasViewport(variant) ? `<ui-navigation-menu-viewport class="${classes.viewport(variant.animation)}" ${viewport}></ui-navigation-menu-viewport>` : ""}
    </ui-navigation-menu>`
}

function mount(root: HTMLElement) {
  kitchenSink(root, "web", (slot, variant, env) => {
    slot.innerHTML = markup(variant, env)
    const menu = slot.querySelector("ui-navigation-menu")!
    if (env.controller) menu.controller = env.controller

    // Callbacks are DOM events on the element. A nested menu's bubble through it.
    menu.addEventListener("valuechange", (event) => {
      const { value, reason } = event.detail
      const nestedMenu = event.target !== menu
      env.log(`${nestedMenu ? "nested " : ""}valueChange ${value} (${reason})`)
      if (!nestedMenu && env.select) env.select.value = value ?? ""
    })
    menu.addEventListener("openchangecomplete", (event) => {
      if (event.target === menu) env.log(`openChangeComplete ${event.detail.value}`)
    })

    // Web components have no controlled prop. The select sets the live `value` instead.
    env.select?.addEventListener("change", () => (menu.value = env.select!.value || null))

    // Show more adds links and widens the first panel while it's open.
    const more = slot.querySelector<HTMLButtonElement>("[data-more]")
    more?.addEventListener("click", () => {
      const content = more.closest<HTMLElement>("ui-navigation-menu-content")!
      const list = content.querySelector("ul")!
      const grown = !list.querySelector("[data-added]")
      if (grown)
        for (const label of moreLinks) {
          list.insertAdjacentHTML("beforeend", link(variant, label))
          list.lastElementChild!.setAttribute("data-added", "")
        }
      else list.querySelectorAll("[data-added]").forEach((el) => el.remove())
      content.className = classes.content(variant, "products", grown)
      more.textContent = grown ? "Show less" : "Show more"
    })
  })
}

export { mount }
