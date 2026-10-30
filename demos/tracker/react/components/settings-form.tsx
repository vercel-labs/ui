"use client"

import { Info } from "lucide-react"
import { useFormStatus } from "react-dom"
import type { Settings } from "tracker-data"
import { saveSettings } from "@/app/actions"
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

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </Button>
  )
}

async function save(form: FormData) {
  try {
    await saveSettings(form)
    toast.success("Settings saved")
  } catch {
    toast.error("Couldn't save your settings. Try again.")
  }
}

function SettingsForm({ settings }: { settings: Settings }) {
  return (
    <form action={save} className="grid gap-8">
      <Field className="flex-row items-center justify-between gap-6">
        <div className="grid gap-1.5">
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
          label={
            <span className="flex items-center gap-1">
              <FieldLabel>Close stale issues after</FieldLabel>
              <Popover>
                <PopoverTrigger
                  aria-label="About stale issues"
                  className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                >
                  <Info aria-hidden="true" />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverTitle className="font-medium">Stale issues</PopoverTitle>
                  <PopoverDescription className="text-muted-foreground">
                    An open issue with no comments or changes for this long moves to Canceled. Its assignee
                    gets an email first.
                  </PopoverDescription>
                </PopoverContent>
              </Popover>
            </span>
          }
        />
      </Field>
      <div className="flex justify-end">
        <SaveButton />
      </div>
    </form>
  )
}

export { SettingsForm }
