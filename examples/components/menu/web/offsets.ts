import "@ui-sdk/web/menu"
import { Check, ChevronDown, createElement } from "lucide"

const fonts = [
  "Inter",
  "Geist",
  "IBM Plex Sans",
  "Source Sans",
  "Work Sans",
  "Manrope",
  "DM Sans",
  "Figtree",
  "Outfit",
  "Lexend",
  "Nunito",
  "Rubik",
  "Karla",
  "Barlow",
  "Mulish",
  "Urbanist",
  "Sora",
  "Onest",
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-menu>
      <ui-menu-trigger>
        <button>
          <span>Inter</span>
          ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-menu-trigger>
      <ui-menu-content side-offset="8" align-offset="-4" collision-padding="24">
        <ui-menu-radio-group value="Inter">
          <ui-menu-group-label>Font</ui-menu-group-label>
          ${fonts
            .map(
              (name) => `
                <ui-menu-radio-item value="${name}" close-on-select>
                  <ui-menu-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-menu-item-indicator>
                  ${name}
                </ui-menu-radio-item>
              `,
            )
            .join("")}
        </ui-menu-radio-group>
      </ui-menu-content>
    </ui-menu>
  `
  const group = root.querySelector("ui-menu-radio-group")!
  group.addEventListener("valuechange", (event) => {
    const { value } = (event as CustomEvent<{ value: string }>).detail
    group.setAttribute("value", value)
    root.querySelector("button > span")!.textContent = value
  })
}

export { mount }
