import { createMenubarController, Menubar } from "@ui-sdk/react/menubar"
import {
  createToolbarController,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from "@ui-sdk/react/toolbar"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
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
import { Input } from "@ui-sdk/react/input"
import { NumberInput, NumberInputControl } from "@ui-sdk/react/number-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { menus, type Variant } from "./variants"

function ToolbarVariant({ variant, env }: { variant: Variant; env: Env }) {
  const [controller] = React.useState(() =>
    variant.controller ? createToolbarController() : undefined
  )
  React.useEffect(() => {
    if (controller) {
      env.controls([["focus()", () => controller.focus()]])
    }
  }, [controller, env])
  const log = (message: string) => () => env.log(message)
  return (
    <Toolbar
      className={classes.bar}
      aria-label={variant.title}
      controller={controller}
      {...variant.options}
    >
      {variant.content === "basic" && (
        <>
          <ToggleGroup
            className={classes.group}
            aria-label="Style"
            multiple
            onValueChange={(value) => env.log(`style [${value}]`)}
          >
            <Toggle className={classes.item} value="bold">
              Bold
            </Toggle>
            <Toggle className={classes.item} value="italic">
              Italic
            </Toggle>
          </ToggleGroup>
          <ToolbarSeparator className={classes.separator} />
          <ToolbarButton className={classes.item} onClick={log("undo")}>
            Undo
          </ToolbarButton>
          <ToolbarButton
            className={classes.item}
            disabled
            focusableWhenDisabled={!variant.skipDisabled}
            onClick={log("redo")}
          >
            Redo
          </ToolbarButton>
          <ToolbarLink className={classes.item} href="#kitchen-sink-help">
            Help
          </ToolbarLink>
        </>
      )}
      {variant.content === "composed" && (
        <>
          <Menu onAction={(value) => env.log(`font ${value}`)}>
            <ToolbarButton className={classes.item} render={<MenuTrigger />}>
              Font
            </ToolbarButton>
            <MenuContent className={classes.popup}>
              {["Sans", "Serif", "Mono"].map((font) => (
                <MenuItem key={font} className={classes.menuItem} value={font}>
                  {font}
                </MenuItem>
              ))}
            </MenuContent>
          </Menu>
          <Select
            defaultValue="100"
            onValueChange={(value) => env.log(`zoom ${value}`)}
          >
            <ToolbarButton
              className={classes.item}
              aria-label="Zoom"
              render={<SelectTrigger />}
            >
              <SelectValue />
            </ToolbarButton>
            <SelectContent className={classes.popup}>
              {["50", "100", "200"].map((zoom) => (
                <SelectItem
                  key={zoom}
                  className={classes.menuItem}
                  value={zoom}
                >
                  {zoom}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <NumberInput
            defaultValue={14}
            onValueChange={(value) => env.log(`size ${value}`)}
          >
            <ToolbarInput
              className={classes.input}
              render={<NumberInputControl aria-label="Size" />}
            />
          </NumberInput>
          <ToolbarInput
            className={classes.input}
            render={<Input aria-label="Find" placeholder="Find" />}
          />
        </>
      )}
      {variant.content === "groups" && (
        <>
          <ToolbarGroup className={classes.group} aria-label="Clipboard">
            <ToolbarButton className={classes.item} onClick={log("cut")}>
              Cut
            </ToolbarButton>
            <ToolbarButton className={classes.item} onClick={log("copy")}>
              Copy
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator className={classes.separator} />
          <ToolbarGroup className={classes.group} aria-label="History" disabled>
            <ToolbarButton className={classes.item} onClick={log("undo")}>
              Undo
            </ToolbarButton>
            <ToolbarButton className={classes.item} onClick={log("redo")}>
              Redo
            </ToolbarButton>
          </ToolbarGroup>
          <Toggle
            className={classes.item}
            onPressedChange={(pressed) => env.log(`wrap ${pressed}`)}
          >
            Wrap
          </Toggle>
        </>
      )}
    </Toolbar>
  )
}

const { file, edit, view, profiles } = menus

// The same menus as data, for the data variant.
const data: MenuData[] = [
  [
    ...file.items,
    {
      type: "submenu",
      label: "Share",
      items: file.share.map((label) => ({ value: label, label })),
    },
  ],
  edit.items!,
  view.checkboxes.map((item) => ({ type: "checkbox" as const, ...item })),
  [
    {
      type: "radio-group",
      name: "profile",
      defaultValue: "Benoit",
      items: profiles.radios.map((label) => ({ value: label, label })),
    },
  ],
]

// A data menu's items as parts, the same way at every level.
function Entries({ items }: { items: MenuData }) {
  return items.map((entry, index) => {
    const item: MenuDataItem =
      typeof entry === "string" ? { value: entry, label: entry } : entry
    switch (item.type) {
      case undefined:
      case "item":
        return (
          <MenuItem
            key={item.value}
            className={classes.menuItem}
            value={item.value}
            shortcut={item.shortcut}
            disabled={item.disabled}
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
            <Entries items={item.items} />
          </MenuGroup>
        )
      case "checkbox":
        return (
          <MenuCheckboxItem
            key={item.value}
            className={classes.menuItem}
            value={item.value}
          >
            {item.label}
          </MenuCheckboxItem>
        )
      case "radio-group":
        return (
          <MenuRadioGroup
            key={item.name}
            name={item.name}
            defaultValue={item.defaultValue}
          >
            {item.items.map((radio) => (
              <MenuRadioItem
                key={radio.value}
                className={classes.menuItem}
                value={radio.value}
              >
                {radio.label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        )
      case "submenu":
        return (
          <MenuSub key={`submenu-${index}`}>
            <MenuSubTrigger className={classes.menuItem}>
              {item.label}
            </MenuSubTrigger>
            <MenuSubContent className={classes.popup}>
              <Entries items={item.items} />
            </MenuSubContent>
          </MenuSub>
        )
    }
  })
}

function MenubarVariant({ variant, env }: { variant: Variant; env: Env }) {
  const [controller] = React.useState(() =>
    variant.controller ? createMenubarController() : undefined
  )
  React.useEffect(() => {
    if (!controller) {
      return
    }
    env.controls([
      ["focus()", () => controller.focus()],
      ["isOpen()", () => controller.isOpen()],
      ["close()", () => controller.close()],
    ])
  }, [controller, env])
  const menuProps = {
    onAction: (value: string) => env.log(`action ${value}`),
    onOpenChange: (
      open: boolean,
      details: { reason: string; source: string }
    ) => env.log(`openChange ${open} (${details.reason}, ${details.source})`),
    onCheckedChange: (checked: boolean, details: { value: string }) =>
      env.log(`${details.value} ${checked}`),
    onValueChange: (value: string) => env.log(`profile ${value}`),
  }
  if (variant.data) {
    return (
      <Menubar
        className={classes.bar}
        aria-label={variant.title}
        controller={controller}
        {...variant.options}
      >
        {[file, edit, view, profiles].map((menu, index) => (
          <Menu key={menu.trigger} items={data[index]} {...menuProps}>
            <MenuTrigger className={classes.item}>{menu.trigger}</MenuTrigger>
            <MenuContent className={classes.popup}>
              <Entries items={data[index]} />
            </MenuContent>
          </Menu>
        ))}
      </Menubar>
    )
  }
  return (
    <Menubar
      className={classes.bar}
      aria-label={variant.title}
      controller={controller}
      {...variant.options}
    >
      <Menu {...menuProps}>
        <MenuTrigger className={classes.item}>{file.trigger}</MenuTrigger>
        <MenuContent className={classes.popup}>
          {file.items.map((item) => (
            <MenuItem
              key={item.value}
              className={classes.menuItem}
              value={item.value}
              shortcut={item.shortcut}
              disabled={item.disabled}
            >
              {item.label}
            </MenuItem>
          ))}
          <MenuSub>
            <MenuSubTrigger className={classes.menuItem}>Share</MenuSubTrigger>
            <MenuSubContent className={classes.popup}>
              {file.share.map((label) => (
                <MenuItem
                  key={label}
                  className={classes.menuItem}
                  value={label}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
      <Menu {...menuProps}>
        <MenuTrigger className={classes.item}>{edit.trigger}</MenuTrigger>
        <MenuContent className={classes.popup}>
          {edit.items.map((item) => (
            <MenuItem
              key={item.value}
              className={classes.menuItem}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuContent>
      </Menu>
      <Menu {...menuProps}>
        <MenuTrigger className={classes.item}>{view.trigger}</MenuTrigger>
        <MenuContent className={classes.popup}>
          {view.checkboxes.map((item) => (
            <MenuCheckboxItem
              key={item.value}
              className={classes.menuItem}
              value={item.value}
            >
              {item.label}
            </MenuCheckboxItem>
          ))}
        </MenuContent>
      </Menu>
      <Menu {...menuProps}>
        <MenuTrigger className={classes.item}>{profiles.trigger}</MenuTrigger>
        <MenuContent className={classes.popup}>
          <MenuRadioGroup
            defaultValue="Benoit"
            onValueChange={(value) => env.log(`profile ${value}`)}
          >
            {profiles.radios.map((label) => (
              <MenuRadioItem
                key={label}
                className={classes.menuItem}
                value={label}
              >
                {label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
          <MenuSeparator className={classes.separator} />
          <MenuItem className={classes.menuItem} value="manage">
            Manage…
          </MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        {variant.section === "Toolbar" ? (
          <ToolbarVariant variant={variant} env={env} />
        ) : (
          <MenubarVariant variant={variant} env={env} />
        )}
      </React.StrictMode>
    )
  )
}

export { mount }
