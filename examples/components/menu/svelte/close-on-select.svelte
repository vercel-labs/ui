<script lang="ts">
  import { CheckIcon, MonitorIcon, ZoomInIcon, ZoomOutIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuSeparator,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  let zoom = $state(100)
  let fit = $state(false)
</script>

<Menu>
  <MenuTrigger aria-label={fit ? "Zoom to fit" : `Zoom ${zoom}%`}>
    <ZoomInIcon />
    {fit ? "Fit" : `${zoom}%`}
  </MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuGroupLabel>Zoom {zoom}%</MenuGroupLabel>
      <MenuItem closeOnSelect={false} disabled={zoom >= 200} onSelect={() => zoom = Math.min(200, zoom + 10)}>
        <ZoomInIcon />
        Zoom in
      </MenuItem>
      <MenuItem closeOnSelect={false} disabled={zoom <= 50} onSelect={() => zoom = Math.max(50, zoom - 10)}>
        <ZoomOutIcon />
        Zoom out
      </MenuItem>
      <MenuItem onSelect={() => zoom = 100}>
        Reset to 100%
      </MenuItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuCheckboxItem bind:checked={fit} value="fit" closeOnSelect>
      <MonitorIcon />
      Fit to window
      <CheckIcon aria-hidden="true" />
    </MenuCheckboxItem>
  </MenuContent>
</Menu>
