import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@ui-sdk/react/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/react/resizable"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/react/slider"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/react/tabs"
import { Toolbar, ToolbarButton } from "@ui-sdk/react/toolbar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { Tree } from "@ui-sdk/react/tree"
import { useState } from "react"
import { createRoot } from "react-dom/client"
import {
  exposeLayers,
  leakComponent,
  leakTreeItems,
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
      <MenuContent className="popup">
        {items.map((item) => (
          <MenuItem key={item.value} className="item" value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  ),
  select: () => (
    <Select defaultValue={items[0].value}>
      <SelectTrigger aria-label="Open" className="trigger">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="popup list-popup">
        {items.map((item) => (
          <SelectItem
            key={item.value}
            className="item"
            value={item.value}
            label={item.label}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  combobox: () => (
    <Combobox>
      <ComboboxInput aria-label="Open" className="input" />
      <ComboboxContent className="popup list-popup">
        <ComboboxList>
          {items.map((item) => (
            <ComboboxItem
              key={item.value}
              className="item"
              value={item.value}
              label={item.label}
            >
              {item.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  popover: () => (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent className="popup" aria-label="Details">
        Details.
        <PopoverClose>Close</PopoverClose>
      </PopoverContent>
    </Popover>
  ),
  dialog: () => (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="dialog">
        <DialogTitle className="title">Delete it?</DialogTitle>
        <DialogDescription className="description">
          This can't be undone.
        </DialogDescription>
        <DialogClose>Cancel</DialogClose>
      </DialogContent>
    </Dialog>
  ),
  tooltip: () => (
    <Tooltip>
      <TooltipTrigger>Open</TooltipTrigger>
      <TooltipContent className="tooltip">A hint.</TooltipContent>
    </Tooltip>
  ),
  slider: () => (
    <Slider name="volume" defaultValue={50}>
      <SliderControl className="slider-control">
        <SliderTrack className="slider-track">
          <SliderIndicator className="slider-indicator" />
          <SliderThumb className="slider-thumb" aria-label="Volume" />
        </SliderTrack>
      </SliderControl>
    </Slider>
  ),
  accordion: () => (
    <Accordion>
      <AccordionItem value="first">
        <AccordionHeader>
          <AccordionTrigger className="accordion-trigger">
            Open
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel className="accordion-panel">An answer.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="second">
        <AccordionHeader>
          <AccordionTrigger className="accordion-trigger">
            Second
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel className="accordion-panel">
          Another answer.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ),
  collapsible: () => (
    <Collapsible>
      <CollapsibleTrigger>Open</CollapsibleTrigger>
      <CollapsiblePanel className="collapsible-panel">
        Details.
      </CollapsiblePanel>
    </Collapsible>
  ),
  tabs: () => (
    <Tabs className="tabs" defaultValue={items[0].value}>
      <TabsList className="tablist" aria-label="Pages">
        {items.map((item) => (
          <TabsTab key={item.value} className="tab" value={item.value}>
            {item.label}
          </TabsTab>
        ))}
        <TabsIndicator className="indicator" />
      </TabsList>
      {items.map((item) => (
        <TabsPanel key={item.value} className="panel" value={item.value}>
          {item.label} content.
        </TabsPanel>
      ))}
    </Tabs>
  ),
  toolbar: () => (
    <Toolbar className="toolbar" aria-label="Formatting">
      {items.map((item) => (
        <ToolbarButton key={item.value}>{item.label}</ToolbarButton>
      ))}
    </Toolbar>
  ),
  tree: () => (
    <Tree className="tree" aria-label="Files" items={leakTreeItems()} />
  ),
  resizable: () => (
    <Resizable className="resizable">
      <ResizablePanel id="first" defaultSize={50} className="resizable-panel" />
      <ResizableHandle className="resizable-handle" aria-label="Handle" />
      <ResizablePanel
        id="second"
        defaultSize={50}
        className="resizable-panel"
      />
    </Resizable>
  ),
  "scroll-area": () => (
    <ScrollArea className="scroll-area" scrollHideDelay={50}>
      <ScrollAreaViewport
        className="scroll-area-viewport"
        role="region"
        aria-label="Items"
      >
        <ScrollAreaContent>
          {lines.map((line) => (
            <p key={line.value} className="scroll-area-item">
              {line.label}
            </p>
          ))}
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar className="scroll-area-scrollbar">
        <ScrollAreaThumb className="scroll-area-thumb" />
      </ScrollAreaScrollbar>
    </ScrollArea>
  ),
}

function Fixture() {
  const [mounted, setMounted] = useState(true)
  const Component = components[leakComponent()]
  return (
    <div className="fixture">
      <button>Before</button>
      {mounted && <Component />}
      <button onClick={() => setMounted((value) => !value)}>Toggle</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  exposeLayers()
  createRoot(root).render(<Fixture />)
}

export { mount }
