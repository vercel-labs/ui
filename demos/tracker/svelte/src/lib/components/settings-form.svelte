<script lang="ts">
  import { Info } from "@lucide/svelte"
  import { enhance, type SubmitFunction } from "$app/forms"
  import { Button, buttonVariants } from "#ui/button"
  import { Field, FieldDescription, FieldLabel } from "#ui/field"
  import { NumberInput } from "#ui/number-input"
  import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "#ui/popover"
  import { Slider } from "#ui/slider"
  import { Switch } from "#ui/switch"
  import { toast } from "#ui/toast"
  import type { Settings } from "tracker-data"

  let { settings }: { settings: Settings } = $props()

  let pending = $state(false)

  const submit: SubmitFunction = () => {
    pending = true
    return async ({ result, update }) => {
      await update({ reset: false })
      pending = false
      if (result.type === "success") toast.success("Settings saved")
      else toast.error("Couldn't save your settings. Try again.")
    }
  }
</script>

<form method="POST" use:enhance={submit} class="grid gap-8">
  <Field class="flex-row items-center justify-between gap-6">
    <div class="grid gap-1.5">
      <FieldLabel>Email notifications</FieldLabel>
      <FieldDescription>Get an email when someone mentions you or assigns you an issue.</FieldDescription>
    </div>
    <Switch name="emailNotifications" defaultChecked={settings.emailNotifications} />
  </Field>
  <Field>
    <FieldLabel>Issues per page</FieldLabel>
    <NumberInput name="pageSize" defaultValue={settings.pageSize} min={5} max={50} step={5} />
    <FieldDescription>How many issues the list shows before it splits into pages.</FieldDescription>
  </Field>
  <Field>
    <Slider
      name="autoCloseDays"
      defaultValue={settings.autoCloseDays}
      min={7}
      max={90}
      step={1}
      format={{ style: "unit", unit: "day", unitDisplay: "long" }}
    >
      {#snippet label()}
        <span class="flex items-center gap-1">
          <FieldLabel>Close stale issues after</FieldLabel>
          <Popover>
            <PopoverTrigger aria-label="About stale issues" class={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
              <Info aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverTitle class="font-medium">Stale issues</PopoverTitle>
              <PopoverDescription class="text-muted-foreground">
                An open issue with no comments or changes for this long moves to Canceled. Its assignee gets an email
                first.
              </PopoverDescription>
            </PopoverContent>
          </Popover>
        </span>
      {/snippet}
    </Slider>
  </Field>
  <div class="flex justify-end">
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </Button>
  </div>
</form>
