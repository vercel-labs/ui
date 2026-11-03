<script lang="ts">
  import {
    Calendar,
    CalendarDay,
    CalendarGrid,
    CalendarHeading,
    CalendarNext,
    CalendarPrevious,
    CalendarWeekday,
  } from "@ui-sdk/svelte/calendar"
  import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte"
</script>

<Calendar defaultValue="2026-10-16">
  {#snippet children(state)}
    <div data-slot="row">
      <CalendarPrevious data-variant="ghost">
        {#snippet render({ props, state: step })}
          <button {...props} title={`Show ${step.month}`}>
            <ChevronLeftIcon />
          </button>
        {/snippet}
      </CalendarPrevious>
      <CalendarHeading>
        {#snippet children(heading)}{heading.label}{/snippet}
      </CalendarHeading>
      <CalendarNext>
        {#snippet render({ props })}
          <button data-variant="ghost" {...props}>
            <ChevronRightIcon />
          </button>
        {/snippet}
      </CalendarNext>
    </div>
    <CalendarGrid>
      {#snippet children(grid)}
        <caption>{grid.label}</caption>
        <thead>
          <tr>
            {#each grid.weekdays as weekday, index (weekday)}
              <CalendarWeekday {index} />
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each grid.weeks as week (week[0]!.date)}
            <tr>
              {#each week as cell (cell.date)}
                {#if cell.hidden}
                  <td></td>
                {:else}
                  <CalendarDay value={cell.date} />
                {/if}
              {/each}
            </tr>
          {/each}
        </tbody>
      {/snippet}
    </CalendarGrid>
    <p data-slot="hint">
      {state.mode}, {state.value ?? "nothing"} selected in {state.month}
      {state.disabled || state.readOnly ? "(locked)" : ""}
    </p>
  {/snippet}
</Calendar>
