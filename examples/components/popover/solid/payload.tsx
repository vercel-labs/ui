import {
  createPopoverController,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal, For } from "solid-js"

type Member = { name: string; role: string }

function Example() {
  const popover = createPopoverController<Member>()
  const [members, setMembers] = createSignal<Member[]>([
    { name: "Ada Lovelace", role: "Owner" },
    { name: "Grace Hopper", role: "Editor" },
    { name: "Alan Turing", role: "Viewer" },
  ])
  const [status, setStatus] = createSignal("")

  return (
    <div data-slot="stack">
      <ul>
        <For each={members()} keyed={(member) => member.name}>
          {(member) => (
            <li data-slot="row">
              {member().name}
              <span data-slot="hint">{member().role}</span>
              <PopoverTrigger
                controller={popover}
                payload={member()}
                disabled={member().role === "Owner"}
                data-size="sm"
                data-variant="ghost"
                aria-label={`Edit ${member().name}`}
              >
                Edit
              </PopoverTrigger>
            </li>
          )}
        </For>
      </ul>
      <Popover
        controller={popover}
        onPayloadChange={(payload) => {
          const member = payload as Member | undefined
          if (member) setStatus(`Editing ${member.name}`)
        }}
      >
        <PopoverContent<Member> align="end">
          {(state) => {
            const member = () => state.payload
            return (
              <>
                <PopoverTitle>Edit {member()?.name}</PopoverTitle>
                <PopoverDescription>Roles decide what they can change.</PopoverDescription>
                <form
                  data-slot="stack"
                  method="dialog"
                  onSubmit={(event) => {
                    const submitter = event.submitter as HTMLButtonElement
                    const editing = member()
                    if (submitter.value !== "save" || !editing) return
                    const next = String(new FormData(event.currentTarget).get("role"))
                    setMembers((current) =>
                      current.map((entry) =>
                        entry.name === editing.name ? { ...entry, role: next } : entry,
                      ),
                    )
                  }}
                >
                  <label data-slot="label">
                    Role
                    <input name="role" value={member()?.role ?? ""} />
                  </label>
                  <div data-slot="row">
                    <button value="save" data-variant="solid">
                      Save
                    </button>
                    <button value="cancel">Cancel</button>
                  </div>
                </form>
              </>
            )
          }}
        </PopoverContent>
      </Popover>
      <button
        type="button"
        data-variant="ghost"
        onClick={async (event) => {
          const result = await popover.open({
            payload: members()[members().length - 1],
            anchor: event.currentTarget,
          })
          setStatus(`Closed with ${result.reason}, returned ${result.returnValue ?? "nothing"}`)
        }}
      >
        Edit the newest member
      </button>
      <output data-slot="output">{status() || "Not edited yet"}</output>
    </div>
  )
}

export { Example }
