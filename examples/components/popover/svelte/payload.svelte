<script lang="ts">
  import {
    createPopoverController,
    Popover,
    PopoverContent,
    type PopoverContentState,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  type Member = { name: string; role: string }

  const popover = createPopoverController<Member>()
  let members = $state<Member[]>([
    { name: "Ada Lovelace", role: "Owner" },
    { name: "Grace Hopper", role: "Editor" },
    { name: "Alan Turing", role: "Viewer" },
  ])
  let status = $state("")

  function save(event: SubmitEvent, member: Member | undefined) {
    if ((event.submitter as HTMLButtonElement).value !== "save" || !member) return
    const next = String(new FormData(event.currentTarget as HTMLFormElement).get("role"))
    members = members.map((entry) => (entry.name === member.name ? { ...entry, role: next } : entry))
  }

  function showEditing(payload: unknown) {
    const member = payload as Member | undefined
    if (member) status = `Editing ${member.name}`
  }

  async function editNewest(event: MouseEvent) {
    const result = await popover.open({
      payload: members[members.length - 1],
      anchor: event.currentTarget as HTMLElement,
    })
    status = `Closed with ${result.reason}, returned ${result.returnValue ?? "nothing"}`
  }
</script>

<div data-slot="stack">
  <ul>
    {#each members as member (member.name)}
      <li data-slot="row">
        {member.name}
        <span data-slot="hint">{member.role}</span>
        <PopoverTrigger
          controller={popover}
          payload={member}
          disabled={member.role === "Owner"}
          data-size="sm"
          data-variant="ghost"
          aria-label={`Edit ${member.name}`}
        >
          Edit
        </PopoverTrigger>
      </li>
    {/each}
  </ul>
  <Popover controller={popover} onPayloadChange={showEditing}>
    <PopoverContent align="end">
      {#snippet children(state: PopoverContentState<Member>)}
        <PopoverTitle>Edit {state.payload?.name}</PopoverTitle>
        <PopoverDescription>Roles decide what they can change.</PopoverDescription>
        <form data-slot="stack" method="dialog" onsubmit={(event) => save(event, state.payload)}>
          <label data-slot="label">
            Role
            {#key state.payload?.name}
              <input name="role" value={state.payload?.role} />
            {/key}
          </label>
          <div data-slot="row">
            <button value="save" data-variant="solid">Save</button>
            <button value="cancel">Cancel</button>
          </div>
        </form>
      {/snippet}
    </PopoverContent>
  </Popover>
  <button type="button" data-variant="ghost" onclick={editNewest}>Edit the newest member</button>
  <output data-slot="output">{status || "Not edited yet"}</output>
</div>
