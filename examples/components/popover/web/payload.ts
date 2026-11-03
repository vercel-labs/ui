import type { UiPopoverElement } from "@ui-sdk/web/popover"
import "@ui-sdk/web/popover"

type Member = { name: string; role: string }

let count = 0

function mount(root: HTMLElement) {
  const id = `member-editor-${++count}`
  const members: Member[] = [
    { name: "Ada Lovelace", role: "Owner" },
    { name: "Grace Hopper", role: "Editor" },
    { name: "Alan Turing", role: "Viewer" },
  ]
  root.innerHTML = `
    <div data-slot="stack">
      <ul></ul>
      <ui-popover id="${id}">
        <ui-popover-content align="end">
          <ui-popover-title></ui-popover-title>
          <ui-popover-description>Roles decide what they can change.</ui-popover-description>
          <form method="dialog" data-slot="stack">
            <label data-slot="label">
              Role
              <input name="role" />
            </label>
            <div data-slot="row">
              <button value="save" data-variant="solid">Save</button>
              <button value="cancel">Cancel</button>
            </div>
          </form>
        </ui-popover-content>
      </ui-popover>
      <button type="button" data-edit-newest data-variant="ghost">Edit the newest member</button>
      <output data-slot="output">Not edited yet</output>
    </div>
  `
  const popover = root.querySelector<UiPopoverElement<Member>>("ui-popover")!
  const form = root.querySelector("form")!

  const rows = new Map<Member, HTMLElement>()
  for (const member of members) {
    const item = document.createElement("li")
    item.dataset.slot = "row"
    item.innerHTML = `${member.name}<span data-slot="hint">${member.role}</span>`
    const trigger = Object.assign(document.createElement("ui-popover-trigger"), { payload: member })
    trigger.setAttribute("for", id)
    trigger.toggleAttribute("disabled", member.role === "Owner")
    trigger.innerHTML = `<button aria-label="Edit ${member.name}" data-size="sm" data-variant="ghost">Edit</button>`
    item.append(trigger)
    rows.set(member, item)
    root.querySelector("ul")!.append(item)
  }

  const show = (member?: Member) => {
    root.querySelector("ui-popover-title")!.textContent = `Edit ${member?.name}`
    form.querySelector("input")!.value = member?.role ?? ""
  }
  popover.addEventListener("payloadchange", (event) => {
    const member = event.detail.value
    show(member)
    if (member) root.querySelector("output")!.textContent = `Editing ${member.name}`
  })
  popover.addEventListener("openchange", (event) => {
    if (event.detail.value) show(popover.api.getPayload())
  })
  form.addEventListener("submit", (event) => {
    const member = popover.api.getPayload()
    if ((event.submitter as HTMLButtonElement).value !== "save" || !member) return
    member.role = String(new FormData(form).get("role"))
    rows.get(member)!.querySelector("span")!.textContent = member.role
  })

  const opener = root.querySelector<HTMLButtonElement>("[data-edit-newest]")!
  opener.addEventListener("click", async () => {
    const result = await popover.api.open({ payload: members[members.length - 1], anchor: opener })
    root.querySelector("output")!.textContent =
      `Closed with ${result.reason}, returned ${result.returnValue ?? "nothing"}`
  })
}

export { mount }
