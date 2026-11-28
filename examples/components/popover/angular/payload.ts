import { Component, computed, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/angular/field"
import {
  createPopoverController,
  Popover,
  PopoverContent,
  type PopoverContentState,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  type PopoverPayloadChange,
} from "@ui-sdk/angular/popover"

type Member = { name: string; role: string }

@Component({
  imports: [
    Field,
    FieldControl,
    FieldLabel,
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="editNewestMember($event)">
          Edit Newest Member
        </button>
      </div>
      <ul data-slot="list">
        @for (member of members(); track member.name) {
          <li data-slot="row">
            {{ member.name }}
            <span data-slot="hint">{{ member.role }}</span>
            <button
              uiPopoverTrigger
              [controller]="popover"
              [payload]="member"
              [disabled]="member.role === 'Owner'"
              data-size="sm"
              data-variant="ghost"
              [attr.aria-label]="\`Edit \${member.name}\`"
            >
              Edit
            </button>
          </li>
        }
      </ul>
      <ng-container
        uiPopover
        [controller]="popover"
        (beforePayloadChange)="onPayloadChange($event)"
      >
        <div *uiPopoverContent="{ align: 'end', sideOffset: 8 }; let content">
          <h2 uiPopoverTitle>{{ payloadOf(content)?.name }}</h2>
          <p uiPopoverDescription>Roles decide what they can change.</p>
          <form
            data-slot="stack"
            method="dialog"
            (submit)="save($event, payloadOf(content))"
          >
            <div uiField>
              <label uiFieldLabel>Role</label>
              <select uiFieldControl name="role">
                @for (role of roles; track role) {
                  <option [selected]="role === payloadOf(content)?.role">
                    {{ role }}
                  </option>
                }
              </select>
            </div>
            <div data-slot="row">
              <button type="submit" value="cancel" formnovalidate>
                Cancel
              </button>
              <button type="submit" value="save" data-variant="solid">
                Save
              </button>
            </div>
          </form>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly roles = ["Admin", "Editor", "Viewer"]

  readonly log = useLog()

  readonly popover = createPopoverController<Member>()

  readonly members = signal<Member[]>([
    { name: "Hollis Grant", role: "Owner" },
    { name: "Inès Moreau", role: "Editor" },
    { name: "Kofi Mensah", role: "Viewer" },
    { name: "Wren Takahashi", role: "Viewer" },
  ])

  readonly newest = computed(() => this.members()[this.members().length - 1])

  save(event: SubmitEvent, member: Member | undefined) {
    if ((event.submitter as HTMLButtonElement).value !== "save" || !member) {
      return
    }
    const role = String(
      new FormData(event.currentTarget as HTMLFormElement).get("role")
    )
    this.members.set(
      this.members().map((entry) =>
        entry.name === member.name ? { ...entry, role } : entry
      )
    )
  }

  payloadOf(state: { payload?: unknown }) {
    return state.payload as Member | undefined
  }

  async editNewestMember(event: MouseEvent) {
    const result = await this.popover.open({
      payload: this.newest(),
      anchor: event.currentTarget as HTMLElement,
    })
    this.log(
      `Closed (${result.reason}), returned ${result.returnValue ?? "nothing"}`
    )
  }

  onPayloadChange(change: PopoverPayloadChange) {
    const member = change.value as Member | undefined
    if (member) {
      this.log(`Editing ${member.name}`)
    }
  }
}

export { Example }
