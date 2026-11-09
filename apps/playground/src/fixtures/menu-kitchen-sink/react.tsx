import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  type MenuData,
  type MenuDataItem,
} from "@ui-sdk/react/menu"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

// The variant's items as parts, the same way at every level.
function Entries({ items, popup }: { items: MenuData; popup: string }) {
  return items.map((entry, index) => {
    const item: MenuDataItem =
      typeof entry === "string" ? { value: entry, label: entry } : entry
    switch (item.type) {
      case undefined:
      case "item":
        return (
          <MenuItem
            key={item.value}
            className={classes.item}
            value={item.value}
            disabled={item.disabled}
            shortcut={item.shortcut}
            closeOnSelect={item.closeOnSelect}
            destructive={item.destructive}
          >
            {item.label}
          </MenuItem>
        )
      case "separator":
        return (
          <MenuSeparator
            key={`separator-${index}`}
            className={classes.separator}
          />
        )
      case "group":
        return (
          <MenuGroup key={`group-${index}`}>
            {item.label && (
              <MenuGroupLabel className={classes.groupLabel}>
                {item.label}
              </MenuGroupLabel>
            )}
            <Entries items={item.items} popup={popup} />
          </MenuGroup>
        )
      case "checkbox":
        return (
          <MenuCheckboxItem
            key={item.value}
            className={classes.item}
            value={item.value}
            disabled={item.disabled}
            checked={item.checked}
            defaultChecked={item.defaultChecked}
            closeOnSelect={item.closeOnSelect}
          >
            <MenuItemIndicator className={classes.indicator}>
              ✓
            </MenuItemIndicator>
            {item.label}
          </MenuCheckboxItem>
        )
      case "radio-group":
        return (
          <MenuRadioGroup
            key={item.name}
            name={item.name}
            value={item.value}
            defaultValue={item.defaultValue}
          >
            {item.label && (
              <MenuGroupLabel className={classes.groupLabel}>
                {item.label}
              </MenuGroupLabel>
            )}
            {item.items.map((radio) => (
              <MenuRadioItem
                key={radio.value}
                className={classes.item}
                value={radio.value}
                disabled={radio.disabled}
              >
                <MenuItemIndicator className={classes.indicator}>
                  •
                </MenuItemIndicator>
                {radio.label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        )
      case "submenu":
        return (
          <MenuSub key={`submenu-${index}`}>
            <MenuSubTrigger className={classes.item} disabled={item.disabled}>
              {item.label}
              <span aria-hidden className={classes.chevron}>
                ›
              </span>
            </MenuSubTrigger>
            <MenuSubContent className={popup}>
              <Entries items={item.items} popup={popup} />
            </MenuSubContent>
          </MenuSub>
        )
    }
  })
}

function VariantMenu({ variant, env }: { variant: Variant; env: Env }) {
  const [open, setOpen] = React.useState(false)
  const popup = classes.content(variant.animation)
  const shared = {
    ...variant.options,
    controller: env.controller,
    container: env.container,
    ...(variant.controlled && { open }),
    onOpenChange: (next: boolean, details: { reason: string }) => {
      if (variant.controlled) {
        setOpen(next)
      }
      env.log(`openChange ${next} (${details.reason})`)
    },
    onAction: (value: string) => env.log(`action ${value}`),
  }

  return (
    <div className="flex items-center gap-3">
      {/* A data menu also knows its items, and reports its checkbox items and radio groups. */}
      <Menu
        {...shared}
        items={variant.mode === "data" ? variant.items : undefined}
      >
        <MenuTrigger className={classes.trigger}>
          {variant.trigger ?? "Open"}
        </MenuTrigger>
        <MenuContent className={popup} {...variant.content}>
          <Entries items={variant.items} popup={popup} />
        </MenuContent>
      </Menu>
      {variant.controlled && (
        <label className="flex items-center gap-1.5 text-xs text-neutral-600">
          <input
            type="checkbox"
            checked={open}
            onChange={(event) => setOpen(event.target.checked)}
          />
          open
        </label>
      )}
    </div>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantMenu variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
