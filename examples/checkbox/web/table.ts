import "@ui-sdk/web/checkbox"
import { Check, createElement, Minus } from "lucide"

const people = [
  { id: "sarah", name: "Sarah Chen", email: "sarah.chen@example.com", role: "Admin" },
  { id: "marcus", name: "Marcus Rodriguez", email: "marcus.rodriguez@example.com", role: "User" },
  { id: "priya", name: "Priya Patel", email: "priya.patel@example.com", role: "User" },
  { id: "david", name: "David Kim", email: "david.kim@example.com", role: "Editor" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-checkbox-group aria-label="Team members" default-value="sarah" all-values="${people.map((person) => person.id).join(",")}">
        <table>
          <thead>
            <tr>
              <th>
                <ui-checkbox aria-label="Select all" parent>
                  <ui-checkbox-indicator>
                    ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                    ${createElement(Minus, { "aria-hidden": "true" }).outerHTML}
                  </ui-checkbox-indicator>
                </ui-checkbox>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            ${people
              .map(
                (person) => `
                  <tr>
                    <td>
                      <ui-checkbox value="${person.id}" aria-label="Select ${person.name}">
                        <ui-checkbox-indicator>
                          ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                        </ui-checkbox-indicator>
                      </ui-checkbox>
                    </td>
                    <td>${person.name}</td>
                    <td>${person.email}</td>
                    <td>${person.role}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </ui-checkbox-group>
      <output data-slot="output">1 of ${people.length} selected</output>
    </div>
  `
  root.querySelector("ui-checkbox-group")!.addEventListener("valuechange", (event) => {
    const { value } = (event as CustomEvent<{ value: string[] }>).detail
    root.querySelector("output")!.textContent = `${value.length} of ${people.length} selected`
  })
}

export { mount }
