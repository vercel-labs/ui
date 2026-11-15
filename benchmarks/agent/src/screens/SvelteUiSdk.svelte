<script lang="ts">
  import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
  } from "@ui-sdk/svelte/accordion"
  import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
  } from "@ui-sdk/svelte/alert-dialog"
  import { Button } from "@ui-sdk/svelte/button"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input } from "@ui-sdk/svelte/input"
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte/menu"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"
  import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/svelte/tabs"
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

  function choose(member: Member, action: string) {
    if (action === "remove") {
      confirmRemoval(member)
    } else {
      member.role = member.role === "admin" ? "member" : "admin"
    }
  }

  function remove() {
    settings.members = settings.members.filter(
      (member) => member.id !== removing?.id
    )
  }
</script>

<main class="screen">
  <h1>Project settings</h1>
  <Tabs defaultValue="general">
    <TabsList class="row" aria-label="Settings">
      <TabsTab value="general">General</TabsTab>
      <TabsTab value="members">Members</TabsTab>
      <TabsTab value="notifications">Notifications</TabsTab>
    </TabsList>

    <TabsPanel value="general" class="screen">
      <Field class="field">
        <FieldLabel>Project name</FieldLabel>
        <Input bind:value={settings.name} />
      </Field>
      <Select bind:value={settings.visibility} items={visibilities}>
        <div class="field">
          <SelectLabel>Visibility</SelectLabel>
          <SelectTrigger class="trigger">
            <SelectValue />
          </SelectTrigger>
        </div>
        <SelectContent class="popup">
          {#each visibilities as item (item.value)}
            <SelectItem value={item.value} class="item">
              {item.label}
            </SelectItem>
          {/each}
        </SelectContent>
      </Select>
    </TabsPanel>

    <TabsPanel value="members">
      <ul class="members">
        {#each settings.members as member (member.id)}
          <li class="row">
            <span class="name">{member.name}</span>
            <span>{member.role === "admin" ? "Admin" : "Member"}</span>
            <Menu onAction={(action) => choose(member, action)}>
              <MenuTrigger
                class="button"
                aria-label={`Actions for ${member.name}`}
              >
                ⋯
              </MenuTrigger>
              <MenuContent class="popup">
                <MenuItem value="role" class="item">
                  {member.role === "admin" ? "Make member" : "Make admin"}
                </MenuItem>
                <MenuItem value="remove" class="item">Remove</MenuItem>
              </MenuContent>
            </Menu>
          </li>
        {/each}
      </ul>
    </TabsPanel>

    <TabsPanel value="notifications">
      <Accordion>
        {#each channels as channel (channel.value)}
          <AccordionItem value={channel.value}>
            <AccordionHeader>
              <AccordionTrigger class="button">{channel.label}</AccordionTrigger
              >
            </AccordionHeader>
            <AccordionPanel class="screen">
              {#each channel.notifications as item (item.value)}
                <label class="choice">
                  <Switch
                    bind:checked={settings[channel.value][item.value]}
                    class="switch"
                  >
                    <SwitchThumb class="switch-thumb" />
                  </Switch>
                  {item.label}
                </label>
              {/each}
            </AccordionPanel>
          </AccordionItem>
        {/each}
      </Accordion>
    </TabsPanel>
  </Tabs>

  <AlertDialog bind:open={isConfirming}>
    <AlertDialogBackdrop class="backdrop" />
    <AlertDialogContent class="dialog">
      <AlertDialogTitle>Remove {removing?.name}?</AlertDialogTitle>
      <AlertDialogDescription>
        They lose access to this project right away.
      </AlertDialogDescription>
      <div class="row">
        <AlertDialogClose class="button">Cancel</AlertDialogClose>
        <AlertDialogClose class="button" onclick={remove}
          >Remove</AlertDialogClose
        >
      </div>
    </AlertDialogContent>
  </AlertDialog>

  <Button class="button" onclick={() => save(settings)}>Save settings</Button>
</main>
