import { readSettings, type Settings } from "tracker-data"
import { Info } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { NumberInput } from "@/components/ui/number-input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { saveSettings } from "@/lib/tracker"

function SettingsForm(props: { settings: Settings }) {
  function submit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault()
    saveSettings(
      readSettings(Object.fromEntries(new FormData(event.currentTarget)))
    )
    toast.success("Settings saved")
  }

  return (
    <form onSubmit={submit} class="grid gap-8">
      <Field class="flex-row items-center justify-between gap-6">
        <div class="grid gap-1.5">
          <FieldLabel>Email notifications</FieldLabel>
          <FieldDescription>
            Get an email when someone mentions you or assigns you an issue.
          </FieldDescription>
        </div>
        <Switch
          name="emailNotifications"
          defaultChecked={props.settings.emailNotifications}
        />
      </Field>
      <Field>
        <FieldLabel>Issues per page</FieldLabel>
        <NumberInput
          name="pageSize"
          defaultValue={props.settings.pageSize}
          min={5}
          max={50}
          step={5}
        />
        <FieldDescription>
          How many issues the list shows before it splits into pages.
        </FieldDescription>
      </Field>
      <Field>
        <Slider
          name="autoCloseDays"
          defaultValue={props.settings.autoCloseDays}
          min={7}
          max={90}
          step={1}
          format={{ style: "unit", unit: "day", unitDisplay: "long" }}
          label={
            <span class="flex items-center gap-1">
              <FieldLabel>Close stale issues after</FieldLabel>
              <Popover>
                <PopoverTrigger
                  aria-label="About stale issues"
                  class={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                >
                  <Info aria-hidden="true" />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverTitle class="font-medium">Stale issues</PopoverTitle>
                  <PopoverDescription class="text-muted-foreground">
                    An open issue with no comments or changes for this long
                    moves to Canceled. Its assignee gets an email first.
                  </PopoverDescription>
                </PopoverContent>
              </Popover>
            </span>
          }
        />
      </Field>
      <div class="flex justify-end">
        <Button type="submit" variant="primary">
          Save changes
        </Button>
      </div>
    </form>
  )
}

export { SettingsForm }
