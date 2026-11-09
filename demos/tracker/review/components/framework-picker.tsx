"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { frameworks, isFramework, type Framework } from "@/lib/frameworks"

function FrameworkPicker({
  framework,
  available,
}: {
  framework: Framework
  available: Framework[]
}) {
  const router = useRouter()
  const items = available.map((value) => ({
    value,
    label: frameworks[value].label,
  }))
  const [value, setValue] = useState(framework)
  const [shown, setShown] = useState(framework)

  if (shown !== framework) {
    setShown(framework)
    setValue(framework)
  }

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (!isFramework(next) || next === value) {
          return
        }
        setValue(next)
        router.push(`?fw=${next}`)
      }}
    >
      <SelectTrigger
        aria-label="Framework"
        className="inline-flex h-8 min-w-0 items-center gap-1 rounded-2xl bg-foreground/5 px-2.5 text-sm outline-none transition-[color,background-color,box-shadow] select-none hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-foreground/10"
      >
        <SelectValue className="truncate" />
        <ChevronDownIcon
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground"
        />
      </SelectTrigger>
      <SelectContent
        align="start"
        sideOffset={6}
        className="max-h-(--available-height) min-w-44 overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none dark:ring-foreground/10"
      >
        {items.map(({ value, label }) => (
          <SelectItem
            key={value}
            value={value}
            className="relative flex min-h-7 cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
          >
            {label}
            <SelectItemIndicator className="absolute end-2 flex size-4 items-center justify-center">
              <CheckIcon aria-hidden="true" className="size-4" />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { FrameworkPicker }
