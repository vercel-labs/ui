<script lang="ts">
  import { CheckIcon, ChevronDownIcon, TextAlignCenterIcon, TextAlignEndIcon, TextAlignStartIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIcon,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectValueIcon,
  } from "@ui-sdk/svelte/select"
</script>

<Select defaultValue="start">
  <div data-slot="stack">
    <SelectLabel>Text alignment</SelectLabel>
    <SelectTrigger>
      <SelectValueIcon />
      <SelectValue />
      <ChevronDownIcon />
    </SelectTrigger>
  </div>
  <SelectContent>
    <SelectItem value="start">
      <SelectItemIcon mirror>
        <TextAlignStartIcon />
      </SelectItemIcon>
      Start
      <SelectItemIndicator>
        <CheckIcon />
      </SelectItemIndicator>
    </SelectItem>
    <SelectItem value="center">
      <SelectItemIcon>
        <TextAlignCenterIcon />
      </SelectItemIcon>
      Center
      <SelectItemIndicator>
        <CheckIcon />
      </SelectItemIndicator>
    </SelectItem>
    <SelectItem value="end">
      <SelectItemIcon mirror>
        <TextAlignEndIcon />
      </SelectItemIcon>
      End
      <SelectItemIndicator>
        <CheckIcon />
      </SelectItemIndicator>
    </SelectItem>
  </SelectContent>
</Select>
