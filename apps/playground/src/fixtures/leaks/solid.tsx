import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/solid/accordion"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/solid/collapsible"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@ui-sdk/solid/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/solid/resizable"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/solid/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/solid/slider"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/solid/tabs"
import { Toolbar, ToolbarButton } from "@ui-sdk/solid/toolbar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { Tree } from "@ui-sdk/solid/tree"
import { Waterfall } from "@ui-sdk/solid/waterfall"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  exposeLayers,
  leakComponent,
  leakTreeItems,
  leakWaterfallItems,
  perfItems,
} from "tests/fixtures/perf.ts"

// One component for the leak specs, picked with ?component=, and a button
// that mounts and unmounts it. The scroll area hides its scrollbars soon after
// the pointer leaves, so the spec sees them show and hide without waiting long.
const items = perfItems(3)
const lines = perfItems(30)

const components = {
  menu: () => (
    <Menu>
      <MenuTrigger>Open</MenuTrigger>
      <MenuContent class="popup">
        <For each={items}>
          {(item) => (
            <MenuItem class="item" value={item.value}>
              {item.label}
            </MenuItem>
          )}
        </For>
      </MenuContent>
    </Menu>
  ),
  select: () => (
    <Select defaultValue={items[0].value}>
      <SelectTrigger aria-label="Open" class="trigger">
        <SelectValue />
      </SelectTrigger>
      <SelectContent class="popup list-popup">
        <For each={items}>
          {(item) => (
            <SelectItem class="item" value={item.value} label={item.label}>
              {item.label}
            </SelectItem>
          )}
        </For>
      </SelectContent>
    </Select>
  ),
  combobox: () => (
    <Combobox>
      <ComboboxInput aria-label="Open" class="input" />
      <ComboboxContent class="popup list-popup">
        <ComboboxList>
          <For each={items}>
            {(item) => (
              <ComboboxItem class="item" value={item.value} label={item.label}>
                {item.label}
              </ComboboxItem>
            )}
          </For>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  popover: () => (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent class="popup" aria-label="Details">
        Details.
        <PopoverClose>Close</PopoverClose>
      </PopoverContent>
    </Popover>
  ),
  dialog: () => (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent class="dialog">
        <DialogTitle class="title">Delete it?</DialogTitle>
        <DialogDescription class="description">
          This can't be undone.
        </DialogDescription>
        <DialogClose>Cancel</DialogClose>
      </DialogContent>
    </Dialog>
  ),
  tooltip: () => (
    <Tooltip>
      <TooltipTrigger>Open</TooltipTrigger>
      <TooltipContent class="tooltip">A hint.</TooltipContent>
    </Tooltip>
  ),
  slider: () => (
    <Slider name="volume" defaultValue={50}>
      <SliderControl class="slider-control">
        <SliderTrack class="slider-track">
          <SliderIndicator class="slider-indicator" />
          <SliderThumb class="slider-thumb" aria-label="Volume" />
        </SliderTrack>
      </SliderControl>
    </Slider>
  ),
  accordion: () => (
    <Accordion>
      <AccordionItem value="first">
        <AccordionHeader>
          <AccordionTrigger class="accordion-trigger">Open</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel class="accordion-panel">An answer.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="second">
        <AccordionHeader>
          <AccordionTrigger class="accordion-trigger">Second</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel class="accordion-panel">Another answer.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
  collapsible: () => (
    <Collapsible>
      <CollapsibleTrigger>Open</CollapsibleTrigger>
      <CollapsiblePanel class="collapsible-panel">Details.</CollapsiblePanel>
    </Collapsible>
  ),
  tabs: () => (
    <Tabs class="tabs" defaultValue={items[0].value}>
      <TabsList class="tablist" aria-label="Pages">
        <For each={items}>
          {(item) => (
            <TabsTab class="tab" value={item.value}>
              {item.label}
            </TabsTab>
          )}
        </For>
        <TabsIndicator class="indicator" />
      </TabsList>
      <For each={items}>
        {(item) => (
          <TabsPanel class="panel" value={item.value}>
            {item.label} content.
          </TabsPanel>
        )}
      </For>
    </Tabs>
  ),
  toolbar: () => (
    <Toolbar class="toolbar" aria-label="Formatting">
      <For each={items}>
        {(item) => <ToolbarButton>{item.label}</ToolbarButton>}
      </For>
    </Toolbar>
  ),
  tree: () => <Tree class="tree" aria-label="Files" items={leakTreeItems()} />,
  waterfall: () => (
    <Waterfall
      class="waterfall"
      aria-label="Trace"
      items={leakWaterfallItems()}
    />
  ),
  resizable: () => (
    <Resizable class="resizable">
      <ResizablePanel id="first" defaultSize={50} class="resizable-panel" />
      <ResizableHandle class="resizable-handle" aria-label="Handle" />
      <ResizablePanel id="second" defaultSize={50} class="resizable-panel" />
    </Resizable>
  ),
  "scroll-area": () => (
    <ScrollArea class="scroll-area" scrollHideDelay={50}>
      <ScrollAreaViewport
        class="scroll-area-viewport"
        role="region"
        aria-label="Items"
      >
        <ScrollAreaContent>
          <For each={lines}>
            {(line) => <p class="scroll-area-item">{line.label}</p>}
          </For>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar class="scroll-area-scrollbar">
        <ScrollAreaThumb class="scroll-area-thumb" />
      </ScrollAreaScrollbar>
    </ScrollArea>
  ),
}

function Fixture() {
  const [mounted, setMounted] = createSignal(true)
  const Component = components[leakComponent()]
  return (
    <div class="fixture">
      <button>Before</button>
      <Show when={mounted()}>
        <Component />
      </Show>
      <button onClick={() => setMounted((value) => !value)}>Toggle</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  exposeLayers()
  render(() => <Fixture />, root)
}

export { mount }
