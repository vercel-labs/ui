import "@ui-sdk/web/trigger-menu"
import { createElement, Users } from "lucide"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-trigger-menu>
      <ui-trigger-menu-input>
        <textarea aria-label="Message" placeholder="Type @ and a first name"></textarea>
      </ui-trigger-menu-input>
      <ui-trigger-menu-content>
        <ui-trigger-menu-list>
          <ui-trigger-menu-group>
            <ui-trigger-menu-group-label>People</ui-trigger-menu-group-label>
            ${people
              .map(
                (person) => `
                  <ui-trigger-menu-item value="${person.value}" label="${person.label}"${person.keywords ? ` keywords="${person.keywords.join(",")}"` : ""}${person.disabled ? " disabled" : ""}>
                    <span aria-hidden="true" data-slot="badge">${person.label[0]}</span>
                    ${person.label}
                  </ui-trigger-menu-item>`,
              )
              .join("")}
          </ui-trigger-menu-group>
          <ui-trigger-menu-separator></ui-trigger-menu-separator>
          <ui-trigger-menu-item value="here" label="here" keywords="everyone,channel">
            <ui-trigger-menu-item-icon>${createElement(Users, { "aria-hidden": "true" }).outerHTML}</ui-trigger-menu-item-icon>
            Notify everyone here
          </ui-trigger-menu-item>
        </ui-trigger-menu-list>
      </ui-trigger-menu-content>
    </ui-trigger-menu>
  `
  const menu = root.querySelector("ui-trigger-menu")!
  menu.triggers = [
    {
      char: "@",
      spaces: 2,
      maxLength: 30,
      pattern: /[\p{L}.'-]/u,
      filter: "startsWith",
      insert: (item) => `@${item.label.split(" ")[0]} `,
    },
  ]
  menu.addEventListener("select", (event) => {
    if (event.detail.value === "here") {
      event.detail.insert("@here ")
    }
  })
}

export { mount }
