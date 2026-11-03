"use client"

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsOverflow,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "@ui-sdk/react/combobox"
import { Check, X } from "lucide-react"

const countries = [
  { value: "ar", label: "Argentina", keywords: ["república argentina"] },
  { value: "au", label: "Australia", keywords: ["oz"] },
  { value: "at", label: "Austria", keywords: ["österreich"] },
  { value: "be", label: "Belgium", keywords: ["belgië", "belgique"] },
  { value: "br", label: "Brazil", keywords: ["brasil"] },
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile" },
  { value: "dk", label: "Denmark", keywords: ["danmark"] },
  { value: "fi", label: "Finland", keywords: ["suomi"] },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany", keywords: ["deutschland"] },
  { value: "gr", label: "Greece", keywords: ["hellas", "ελλάδα"] },
  { value: "jp", label: "Japan", keywords: ["nippon", "日本"] },
  { value: "nl", label: "Netherlands", keywords: ["holland", "nederland"] },
  { value: "es", label: "Spain", keywords: ["españa"] },
  { value: "se", label: "Sweden", keywords: ["sverige"] },
  { value: "ch", label: "Switzerland", keywords: ["schweiz", "suisse", "svizzera"] },
]

const countryLabel = (value: string) => countries.find((country) => country.value === value)?.label ?? value

function Example() {
  return (
    <Combobox multiple defaultValue={["fr", "jp", "se", "de", "ch"]} itemToLabel={countryLabel}>
      <div className="flex w-80 max-w-full flex-col gap-2">
        <ComboboxLabel className="text-sm leading-none font-medium">Countries</ComboboxLabel>
        <ComboboxChips className="box-border flex h-8 w-full flex-nowrap items-center gap-1 rounded-2xl border border-transparent bg-input/50 bg-clip-padding px-1 py-0 text-sm leading-5 transition-[color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 overflow-hidden">
          <ComboboxValue>
            {(state) =>
              (state.value as string[]).map((value, index) => (
                <ComboboxChip
                  key={value}
                  value={value}
                  className="box-border flex h-5.25 w-fit items-center justify-center gap-1 rounded-2xl bg-input ps-1.5 pe-0.5 text-xs leading-4 font-medium whitespace-nowrap text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30 shrink-0"
                >
                  {state.labels[index]}
                  <ComboboxChipRemove
                    aria-label={`Remove ${state.labels[index]}`}
                    className="-ms-0.5 flex size-4.5 cursor-default items-center justify-center rounded-full border-0 bg-transparent p-0 text-inherit opacity-50 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none"
                  >
                    <X aria-hidden="true" className="pointer-events-none block size-3 shrink-0" />
                  </ComboboxChipRemove>
                </ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxChipsOverflow
            className="shrink-0 px-1 text-xs leading-4 font-medium whitespace-nowrap text-muted-foreground"
            render={(props, state) => (
              <span {...props} title={state.labels.join(", ")}>
                +{state.count}
              </span>
            )}
          />
          <ComboboxInput
            placeholder="Add"
            className="h-6 min-w-16 flex-1 border-0 bg-transparent px-1.5 py-0 text-base leading-6 text-inherit outline-none placeholder:text-muted-foreground md:text-sm md:leading-5"
          />
        </ComboboxChips>
        <p className="m-0 min-h-5 text-sm leading-5 text-muted-foreground">
          <ComboboxValue maxLabels={2} getMoreLabel={(count) => `${count} more`} />
        </p>
      </div>
      <ComboboxContent className="max-h-[min(18rem,var(--available-height))] scroll-py-1 overflow-x-hidden overflow-y-auto box-border w-(--anchor-width) min-w-36 rounded-2xl border-0 bg-popover p-1 text-sm leading-5 text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none origin-(--transform-origin) transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0">
        <ComboboxEmpty className="m-0 py-2 text-center text-sm leading-5 text-muted-foreground empty:hidden">
          No countries found.
        </ComboboxEmpty>
        <ComboboxList>
          {countries.map((country) => (
            <ComboboxItem
              key={country.value}
              value={country.value}
              label={country.label}
              className="relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm leading-5 outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 ring-ring/30 ring-inset in-data-[modality=keyboard]:data-highlighted:ring-2"
            >
              {country.label}
              <ComboboxItemIndicator className="pointer-events-none absolute end-2 flex size-4 items-center justify-center">
                <Check aria-hidden="true" className="pointer-events-none block size-4 shrink-0" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { Example }
