import { Component, signal } from "@angular/core"
import { LucideCheck, LucideMinus } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
} from "@ui-sdk/angular/checkbox"

@Component({
  imports: [
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
    LucideCheck,
    LucideMinus,
  ],
  template: `
    <div
      uiCheckboxGroup
      [(value)]="selected"
      aria-label="Team members"
      (beforeValueChange)="
        log($event.value.length + ' of ' + people.length + ' selected')
      "
      [allValues]="people.map((person) => person.id)"
    >
      <table>
        <caption data-slot="visually-hidden">
          Team members
        </caption>
        <thead>
          <tr>
            <th>
              <button uiCheckbox aria-label="Select all" parent>
                <span uiCheckboxIndicator>
                  <svg lucideCheck></svg>
                  <svg lucideMinus></svg>
                </span>
              </button>
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          @for (person of people; track person.id) {
            <tr>
              <td>
                <button
                  uiCheckbox
                  [value]="person.id"
                  [aria-label]="\`Select \${person.name}\`"
                >
                  <span uiCheckboxIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </button>
              </td>
              <td>{{ person.name }}</td>
              <td>{{ person.email }}</td>
              <td>{{ person.role }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
class Example {
  readonly people = [
    {
      id: "hollis",
      name: "Hollis Grant",
      email: "hollis@example.com",
      role: "Owner",
    },
    {
      id: "ines",
      name: "Inès Moreau",
      email: "ines@example.com",
      role: "Editor",
    },
    {
      id: "kofi",
      name: "Kofi Mensah",
      email: "kofi@example.com",
      role: "Viewer",
    },
    {
      id: "wren",
      name: "Wren Takahashi",
      email: "wren@example.com",
      role: "Editor",
    },
  ]

  readonly log = useLog()

  readonly selected = signal(["hollis"])
}

export { Example }
