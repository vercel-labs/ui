<script lang="ts">
  import { UsersIcon } from "@lucide/svelte"
  import {
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuGroup,
    TriggerMenuGroupLabel,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuItemIcon,
    TriggerMenuList,
    TriggerMenuSeparator,
    type TriggerMenuSelectDetails,
  } from "@ui-sdk/svelte/trigger-menu"

  const people = [
    { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
    { value: "alan", label: "Alan Turing" },
    { value: "grace", label: "Grace Hopper" },
    { value: "katherine", label: "Katherine Johnson" },
    { value: "linus", label: "Linus Torvalds", disabled: true },
    { value: "margaret", label: "Margaret Hamilton" },
  ]

  const triggers = [
    {
      char: "@",
      spaces: 2,
      maxLength: 30,
      pattern: /[\p{L}.'-]/u,
      filter: "startsWith" as const,
      insert: (item: { label: string }) => `@${item.label.split(" ")[0]} `,
    },
  ]

  const here = (value: string, details: TriggerMenuSelectDetails<string>) => details.insert("@here ")
</script>

<TriggerMenu {triggers}>
  <TriggerMenuInput aria-label="Message" placeholder="Type @ and a first name" />
  <TriggerMenuContent>
    <TriggerMenuList>
      <TriggerMenuGroup>
        <TriggerMenuGroupLabel>People</TriggerMenuGroupLabel>
        {#each people as person (person.value)}
          <TriggerMenuItem
            value={person.value}
            label={person.label}
            keywords={person.keywords}
            disabled={person.disabled}
          >
            <span aria-hidden="true" data-slot="badge">{person.label[0]}</span>
            {person.label}
          </TriggerMenuItem>
        {/each}
      </TriggerMenuGroup>
      <TriggerMenuSeparator />
      <TriggerMenuItem value="here" label="here" keywords={["everyone", "channel"]} onSelect={here}>
        <TriggerMenuItemIcon>
          <UsersIcon />
        </TriggerMenuItemIcon>
        Notify everyone here
      </TriggerMenuItem>
    </TriggerMenuList>
  </TriggerMenuContent>
</TriggerMenu>
