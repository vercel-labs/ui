<script lang="ts">
  import {
    Accordion,
    AlertDialog,
    Button,
    DropdownMenu,
    Label,
    Select,
    Switch,
    Tabs,
  } from "bits-ui"
  import {
    channels,
    initialSettings,
    type Member,
    save,
    visibilities,
  } from "../settings"

  const settings = $state(initialSettings())
  let removing = $state<Member | null>(null)
  let isConfirming = $state(false)

  function confirmRemoval(member: Member) {
    removing = member
    isConfirming = true
  }
  const visibility = $derived(
    visibilities.find((item) => item.value === settings.visibility)?.label
  )

  function toggleRole(member: Member) {
    member.role = member.role === "admin" ? "member" : "admin"
  }

  function remove() {
    settings.members = settings.members.filter(
      (member) => member.id !== removing?.id
    )
    isConfirming = false
  }
</script>

<main class="screen">
  <h1>Project settings</h1>
  <Tabs.Root value="general">
    <Tabs.List class="row" aria-label="Settings">
      <Tabs.Trigger value="general">General</Tabs.Trigger>
      <Tabs.Trigger value="members">Members</Tabs.Trigger>
      <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="general" class="screen">
      <div class="field">
        <Label.Root for="project-name">Project name</Label.Root>
        <input id="project-name" bind:value={settings.name} />
      </div>
      <div class="field">
        <Label.Root for="visibility">Visibility</Label.Root>
        <Select.Root
          type="single"
          bind:value={settings.visibility}
          items={visibilities}
        >
          <Select.Trigger id="visibility" class="trigger">
            {visibility}
          </Select.Trigger>
          <Select.Portal>
            <Select.Content class="popup" sideOffset={4}>
              <Select.Viewport>
                {#each visibilities as item (item.value)}
                  <Select.Item
                    value={item.value}
                    label={item.label}
                    class="item"
                  >
                    {item.label}
                  </Select.Item>
                {/each}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </Tabs.Content>

    <Tabs.Content value="members">
      <ul class="members">
        {#each settings.members as member (member.id)}
          <li class="row">
            <span class="name">{member.name}</span>
            <span>{member.role === "admin" ? "Admin" : "Member"}</span>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                class="button"
                aria-label={`Actions for ${member.name}`}
              >
                ⋯
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content class="popup" sideOffset={4}>
                  <DropdownMenu.Item
                    class="item"
                    onSelect={() => toggleRole(member)}
                  >
                    {member.role === "admin" ? "Make member" : "Make admin"}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    class="item"
                    onSelect={() => confirmRemoval(member)}
                  >
                    Remove
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </li>
        {/each}
      </ul>
    </Tabs.Content>

    <Tabs.Content value="notifications">
      <Accordion.Root type="single">
        {#each channels as channel (channel.value)}
          <Accordion.Item value={channel.value}>
            <Accordion.Header>
              <Accordion.Trigger class="button"
                >{channel.label}</Accordion.Trigger
              >
            </Accordion.Header>
            <Accordion.Content class="screen">
              {#each channel.notifications as item (item.value)}
                <label class="choice">
                  <Switch.Root
                    bind:checked={settings[channel.value][item.value]}
                    class="switch"
                  >
                    <Switch.Thumb class="switch-thumb" />
                  </Switch.Root>
                  {item.label}
                </label>
              {/each}
            </Accordion.Content>
          </Accordion.Item>
        {/each}
      </Accordion.Root>
    </Tabs.Content>
  </Tabs.Root>

  <AlertDialog.Root bind:open={isConfirming}>
    <AlertDialog.Portal>
      <AlertDialog.Overlay class="backdrop" />
      <AlertDialog.Content class="dialog">
        <AlertDialog.Title>Remove {removing?.name}?</AlertDialog.Title>
        <AlertDialog.Description>
          They lose access to this project right away.
        </AlertDialog.Description>
        <div class="row">
          <AlertDialog.Cancel class="button">Cancel</AlertDialog.Cancel>
          <AlertDialog.Action class="button" onclick={remove}>
            Remove
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>

  <Button.Root class="button" onclick={() => save(settings)}>
    Save settings
  </Button.Root>
</main>
