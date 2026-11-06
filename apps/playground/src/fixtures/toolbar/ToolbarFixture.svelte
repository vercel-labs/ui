<script lang="ts">
  import {
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    NumberInput,
    NumberInputControl,
    Toggle,
    ToggleGroup,
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
    ToolbarInput,
    ToolbarLink,
    ToolbarSeparator,
    createToolbarController,
  } from "@ui-sdk/svelte"
  import { toolbarFixture as f, toolbarLocked, toolbarOptions } from "tests/fixtures/toolbar.ts"

  let action = $state("")
  const controller = createToolbarController()
  const options = toolbarOptions()
  // For ?locked: disabled groups around Text style, Spellcheck, History and Help until Unlock.
  const lockable = toolbarLocked()
  let locked = $state(lockable)
  const groups = [
    { ...f.style, multiple: true },
    { ...f.alignment, multiple: false },
  ]
</script>

<!-- Declared outside the toolbar: a snippet inside a component's tag becomes one of its props. -->
{#snippet spellcheckToggle()}
  <Toggle class="toggle" onPressedChange={(pressed) => (action = `spellcheck: ${pressed ? "on" : "off"}`)}>
    {f.spellcheck.label}
  </Toggle>
{/snippet}
{#snippet helpLink()}
  <ToolbarLink href={f.help.href}>{f.help.label}</ToolbarLink>
{/snippet}

<div class="fixture">
  <button>Before</button>
  <Toolbar class="toolbar" aria-label={f.label} {controller} {...options}>
    {#each groups as group, index (group.label)}
      {#snippet toggles()}
        <ToggleGroup
          class="toggle-group"
          aria-label={group.label}
          multiple={group.multiple}
          defaultValue={group.defaultValue}
          onValueChange={(value) => (action = `${group.label}: ${value.join(", ") || "none"}`)}
        >
          {#each group.items as item (item.value)}
            <Toggle class="toggle" value={item.value} disabled={(item as { disabled?: boolean }).disabled}>
              {item.label}
            </Toggle>
          {/each}
        </ToggleGroup>
      {/snippet}
      {#if lockable && index === 0}
        <ToolbarGroup aria-label="Locked style" disabled={locked}>{@render toggles()}</ToolbarGroup>
      {:else}
        {@render toggles()}
      {/if}
      {#if index < groups.length}
        <ToolbarSeparator />
      {/if}
    {/each}
    <Menu onAction={(value) => (action = `font: ${value}`)}>
      <ToolbarButton>
        {#snippet render({ props })}
          <MenuTrigger {...props}>{f.font.trigger}</MenuTrigger>
        {/snippet}
      </ToolbarButton>
      <MenuContent class="popup">
        {#each f.font.items as item (item)}
          <MenuItem class="item" value={item}>{item}</MenuItem>
        {/each}
      </MenuContent>
    </Menu>
    <NumberInput defaultValue={f.size.defaultValue} onValueChange={(value) => (action = `size: ${value}`)}>
      <ToolbarInput aria-label={f.size.label}>
        {#snippet render({ props })}
          <NumberInputControl {...props} />
        {/snippet}
      </ToolbarInput>
    </NumberInput>
    <ToolbarInput aria-label={f.comment.label} value={f.comment.defaultValue} />
    <ToolbarGroup class="toolbar-group" aria-label={f.history.label} disabled={lockable && locked}>
      {#each f.history.items as item (item.label)}
        <ToolbarButton
          disabled={(item as { disabled?: boolean }).disabled}
          onclick={() => (action = item.label.toLowerCase())}
        >
          {item.label}
        </ToolbarButton>
      {/each}
    </ToolbarGroup>
    {#if lockable}
      <ToolbarGroup aria-label="Locked proofing" disabled={locked}>{@render spellcheckToggle()}</ToolbarGroup>
    {:else}
      {@render spellcheckToggle()}
    {/if}
    {#if lockable}
      <ToolbarGroup aria-label="Locked help" disabled={locked}>{@render helpLink()}</ToolbarGroup>
    {:else}
      {@render helpLink()}
    {/if}
  </Toolbar>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <button onclick={() => controller.focus()}>Focus toolbar</button>
  <button onclick={() => (locked = false)}>Unlock</button>
</div>
