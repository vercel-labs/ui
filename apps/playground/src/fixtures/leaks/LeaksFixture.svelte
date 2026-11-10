<script lang="ts">
  import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
    Resizable,
    ResizableHandle,
    ResizablePanel,
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Slider,
    SliderControl,
    SliderIndicator,
    SliderThumb,
    SliderTrack,
    Tabs,
    TabsIndicator,
    TabsList,
    TabsPanel,
    TabsTab,
    Toolbar,
    ToolbarButton,
    Tree,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    Waterfall,
  } from "@ui-sdk/svelte"
  import {
    leakComponent,
    leakTreeItems,
    leakWaterfallItems,
    perfItems,
  } from "tests/fixtures/perf.ts"

  // One component for the leak specs, picked with ?component=, and a button
  // that mounts and unmounts it. The scroll area hides its scrollbars soon
  // after the pointer leaves, so the spec sees them show and hide without
  // waiting long.
  const items = perfItems(3)
  const lines = perfItems(30)
  const component = leakComponent()
  let mounted = $state(true)
</script>

<div class="fixture">
  <button>Before</button>
  {#if mounted}
    {#if component === "menu"}
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent class="popup">
          {#each items as item (item.value)}
            <MenuItem class="item" value={item.value}>{item.label}</MenuItem>
          {/each}
        </MenuContent>
      </Menu>
    {:else if component === "select"}
      <Select defaultValue={items[0].value}>
        <SelectTrigger aria-label="Open" class="trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent class="popup list-popup">
          {#each items as item (item.value)}
            <SelectItem class="item" value={item.value} label={item.label}
              >{item.label}</SelectItem
            >
          {/each}
        </SelectContent>
      </Select>
    {:else if component === "combobox"}
      <Combobox>
        <ComboboxInput aria-label="Open" class="input" />
        <ComboboxContent class="popup list-popup">
          <ComboboxList>
            {#each items as item (item.value)}
              <ComboboxItem class="item" value={item.value} label={item.label}
                >{item.label}</ComboboxItem
              >
            {/each}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    {:else if component === "popover"}
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent class="popup" aria-label="Details">
          Details.
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    {:else if component === "dialog"}
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent class="dialog">
          <DialogTitle class="title">Delete it?</DialogTitle>
          <DialogDescription class="description"
            >This can't be undone.</DialogDescription
          >
          <DialogClose>Cancel</DialogClose>
        </DialogContent>
      </Dialog>
    {:else if component === "slider"}
      <Slider name="volume" defaultValue={50}>
        <SliderControl class="slider-control">
          <SliderTrack class="slider-track">
            <SliderIndicator class="slider-indicator" />
            <SliderThumb class="slider-thumb" aria-label="Volume" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    {:else if component === "accordion"}
      <Accordion>
        <AccordionItem value="first">
          <AccordionHeader>
            <AccordionTrigger class="accordion-trigger">Open</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel class="accordion-panel">An answer.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionHeader>
            <AccordionTrigger class="accordion-trigger">Second</AccordionTrigger
            >
          </AccordionHeader>
          <AccordionPanel class="accordion-panel"
            >Another answer.</AccordionPanel
          >
        </AccordionItem>
      </Accordion>
    {:else if component === "collapsible"}
      <Collapsible>
        <CollapsibleTrigger>Open</CollapsibleTrigger>
        <CollapsiblePanel class="collapsible-panel">Details.</CollapsiblePanel>
      </Collapsible>
    {:else if component === "tabs"}
      <Tabs class="tabs" defaultValue={items[0].value}>
        <TabsList class="tablist" aria-label="Pages">
          {#each items as item (item.value)}
            <TabsTab class="tab" value={item.value}>{item.label}</TabsTab>
          {/each}
          <TabsIndicator class="indicator" />
        </TabsList>
        {#each items as item (item.value)}
          <TabsPanel class="panel" value={item.value}
            >{item.label} content.</TabsPanel
          >
        {/each}
      </Tabs>
    {:else if component === "toolbar"}
      <Toolbar class="toolbar" aria-label="Formatting">
        {#each items as item (item.value)}
          <ToolbarButton>{item.label}</ToolbarButton>
        {/each}
      </Toolbar>
    {:else if component === "tree"}
      <Tree class="tree" aria-label="Files" items={leakTreeItems()} />
    {:else if component === "waterfall"}
      <Waterfall
        class="waterfall"
        aria-label="Trace"
        items={leakWaterfallItems()}
      />
    {:else if component === "resizable"}
      <Resizable class="resizable">
        <ResizablePanel id="first" defaultSize={50} class="resizable-panel" />
        <ResizableHandle class="resizable-handle" aria-label="Handle" />
        <ResizablePanel id="second" defaultSize={50} class="resizable-panel" />
      </Resizable>
    {:else if component === "scroll-area"}
      <ScrollArea class="scroll-area" scrollHideDelay={50}>
        <ScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          aria-label="Items"
        >
          <ScrollAreaContent>
            {#each lines as line (line.value)}
              <p class="scroll-area-item">{line.label}</p>
            {/each}
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar class="scroll-area-scrollbar">
          <ScrollAreaThumb class="scroll-area-thumb" />
        </ScrollAreaScrollbar>
      </ScrollArea>
    {:else}
      <Tooltip>
        <TooltipTrigger>Open</TooltipTrigger>
        <TooltipContent class="tooltip">A hint.</TooltipContent>
      </Tooltip>
    {/if}
  {/if}
  <button onclick={() => (mounted = !mounted)}>Toggle</button>
</div>
