<script lang="ts">
  import { EllipsisIcon } from "@lucide/svelte"
  import {
    createMenuController,
    Menu,
    MenuContent,
    type MenuContentState,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuSeparator,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  type File = { name: string; size: string }

  const files: File[] = [
    { name: "Roadmap.pdf", size: "2.4 MB" },
    { name: "Budget.xlsx", size: "860 KB" },
    { name: "Team photo.jpg", size: "5.1 MB" },
  ]

  const menu = createMenuController<File>()
  let status = $state("")

  async function openFirst(event: MouseEvent) {
    const result = await menu.open({ payload: files[0], anchor: event.currentTarget as HTMLElement })
    status = `Closed with ${result.reason}`
  }
</script>

<div data-slot="stack">
  <ul>
    {#each files as file (file.name)}
      <li data-slot="row">
        {file.name}
        <span data-slot="hint">{file.size}</span>
        <MenuTrigger
          controller={menu}
          payload={file}
          aria-label={`Actions for ${file.name}`}
          data-variant="ghost"
          data-size="sm"
        >
          <EllipsisIcon aria-hidden="true" />
        </MenuTrigger>
      </li>
    {/each}
  </ul>
  <Menu controller={menu} onAction={(action: string) => (status = `${action} ${menu.getPayload()?.name}`)}>
    <MenuContent align="end">
      {#snippet children(state: MenuContentState<File>)}
        <MenuGroup>
          <MenuGroupLabel>{state.payload?.name}</MenuGroupLabel>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="rename">Rename</MenuItem>
          <MenuItem value="duplicate">Duplicate</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem value="delete">Delete</MenuItem>
      {/snippet}
    </MenuContent>
  </Menu>
  <button data-variant="ghost" onclick={openFirst}>Open for {files[0].name}</button>
  <output data-slot="output">{status || "Pick a file's actions"}</output>
</div>
