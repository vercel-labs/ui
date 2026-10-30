<script lang="ts">
  import { Calendar, CalendarNext, CalendarPrevious } from "../../src/calendar"
  import { Combobox, ComboboxInput, ComboboxLabel } from "../../src/combobox"

  let { view }: { view: string } = $props()
</script>

{#if view === "calendar"}
  <Calendar defaultMonth="2026-10">
    <CalendarPrevious aria-label="Mois précédent" />
    <CalendarNext data-slot="next" />
  </Calendar>
{:else if view === "combobox"}
  <Combobox>
    <ComboboxLabel>Email</ComboboxLabel>
    <ComboboxInput autocomplete="email" aria-label="Work email" role="textbox" />
  </Combobox>
{/if}
