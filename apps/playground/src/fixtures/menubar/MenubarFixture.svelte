<script lang="ts">
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuItem,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
    Menubar,
    createMenubarController,
  } from "@ui-sdk/svelte"
  import {
    menubarFixture as f,
    menubarOptions,
  } from "tests/fixtures/menubar.ts"

  let action = $state("")
  const options = menubarOptions()
  const run = (value: string) => (action = value)
  const controller = createMenubarController()
  // Specs drive the menubar through its controller. Only in the browser: the server has no window.
  $effect(() => {
    ;(window as unknown as { __menubar: typeof controller }).__menubar =
      controller
  })
</script>

<div class="fixture">
  <button>Before</button>
  <Menubar class="menubar" aria-label={f.label} {controller} {...options}>
    <Menu onAction={run}>
      <MenuTrigger>{f.file.trigger}</MenuTrigger>
      <MenuContent class="popup">
        {#each f.file.items as item (item.value)}
          <MenuItem class="item" value={item.value} shortcut={item.shortcut}
            >{item.label}</MenuItem
          >
        {/each}
        <MenuSub>
          <MenuSubTrigger class="item">{f.file.share.trigger}</MenuSubTrigger>
          <MenuSubContent class="popup">
            {#each f.file.share.items as item (item.value)}
              <MenuItem class="item" value={item.value}>{item.label}</MenuItem>
            {/each}
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator class="separator" />
        <MenuItem class="item" value={f.file.print.value}
          >{f.file.print.label}</MenuItem
        >
      </MenuContent>
    </Menu>
    <Menu onAction={run}>
      <MenuTrigger>{f.edit.trigger}</MenuTrigger>
      <MenuContent class="popup">
        {#each f.edit.items as item (item.value)}
          <MenuItem class="item" value={item.value} disabled={item.disabled}
            >{item.label}</MenuItem
          >
        {/each}
      </MenuContent>
    </Menu>
    <Menu
      onCheckedChange={(checked, details) =>
        run(`${details.value}: ${checked ? "on" : "off"}`)}
    >
      <MenuTrigger shortcut={f.view.shortcut}>{f.view.trigger}</MenuTrigger>
      <MenuContent class="popup">
        {#each f.view.checkboxes as item (item.value)}
          <MenuCheckboxItem
            class="item"
            value={item.value}
            defaultChecked={item.defaultChecked}
          >
            {item.label}
          </MenuCheckboxItem>
        {/each}
      </MenuContent>
    </Menu>
    <Menu>
      <MenuTrigger>{f.profiles.trigger}</MenuTrigger>
      <MenuContent class="popup">
        <MenuRadioGroup
          defaultValue={f.profiles.defaultValue}
          onValueChange={(value) => run(`profile: ${value}`)}
        >
          {#each f.profiles.items as item (item.value)}
            <MenuRadioItem class="item" value={item.value}
              >{item.label}</MenuRadioItem
            >
          {/each}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
    <Menu onAction={run}>
      <MenuTrigger disabled>{f.help.trigger}</MenuTrigger>
      <MenuContent class="popup">
        {#each f.help.items as item (item.value)}
          <MenuItem class="item" value={item.value}>{item.label}</MenuItem>
        {/each}
      </MenuContent>
    </Menu>
  </Menubar>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
