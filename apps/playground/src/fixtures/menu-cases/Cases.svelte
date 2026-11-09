<script lang="ts">
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuGroupLabel,
    MenuItem,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
  } from "@ui-sdk/svelte"

  let action = $state("")
  let selections = $state(0)
  let align = $state("left")
  let open = $state(false)
  // Specs close the controlled menu from outside it.
  ;(window as unknown as { __closeControlled: () => void }).__closeControlled =
    () => (open = false)

  function closeFromState(event: Event) {
    event.preventDefault()
    open = false
  }

  function keepOpen(event: Event) {
    event.preventDefault()
    selections++
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Menu onAction={(value) => (action = value)}>
    <MenuTrigger>Edit</MenuTrigger>
    <MenuContent class="popup">
      <MenuItem class="item" value="pin" onSelect={keepOpen}>Pin</MenuItem>
      <MenuItem class="item" value="zoom" closeOnSelect={false}
        >Zoom in</MenuItem
      >
      <MenuItem class="item" value="erase" shortcut="mod+backspace"
        >Erase</MenuItem
      >
      <MenuItem class="item" value="window" shortcut="alt+n"
        >New window</MenuItem
      >
      <MenuSeparator class="separator" />
      <MenuCheckboxItem class="item" value="autosave" closeOnSelect
        >Autosave</MenuCheckboxItem
      >
      <!-- Controlled and always checked: the binding's getter decides, and its setter writes nothing. -->
      <MenuCheckboxItem
        class="item"
        value="pinned"
        bind:checked={() => true, () => {}}>Pinned</MenuCheckboxItem
      >
      <MenuRadioGroup bind:value={align}>
        <MenuGroupLabel class="label">Align</MenuGroupLabel>
        <MenuRadioItem class="item" value="left">Left</MenuRadioItem>
        <MenuRadioItem class="item" value="right">Right</MenuRadioItem>
      </MenuRadioGroup>
      <MenuSub>
        <MenuSubTrigger class="item" disabled>Share</MenuSubTrigger>
        <MenuSubContent class="popup">
          <MenuItem class="item" value="email">Email</MenuItem>
        </MenuSubContent>
      </MenuSub>
      <MenuSub loop={false}>
        <MenuSubTrigger class="item">More</MenuSubTrigger>
        <MenuSubContent class="popup">
          <MenuItem class="item" value="first">First</MenuItem>
          <MenuItem class="item" value="last">Last</MenuItem>
        </MenuSubContent>
      </MenuSub>
    </MenuContent>
  </Menu>
  <Menu>
    <MenuTrigger>Offsets</MenuTrigger>
    <MenuContent
      class="popup"
      sideOffset={8}
      alignOffset={-4}
      collisionPadding={24}
    >
      <MenuItem class="item" value="one">One</MenuItem>
      <MenuItem class="item" value="two">Two</MenuItem>
    </MenuContent>
  </Menu>
  <Menu bind:open>
    <MenuTrigger>Controlled</MenuTrigger>
    <MenuContent class="popup">
      <MenuItem class="item" value="done" onSelect={closeFromState}
        >Done</MenuItem
      >
      <MenuItem class="item" value="later">Later</MenuItem>
    </MenuContent>
  </Menu>
  <button onclick={() => (align = "right")}>Align right</button>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Selections">{selections}</output>
</div>
