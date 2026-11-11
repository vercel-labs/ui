<script setup lang="ts">
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
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
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
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
} from "@ui-sdk/vue"
import {
  leakComponent,
  leakTreeItems,
  leakWaterfallItems,
  perfItems,
} from "tests/fixtures/perf.ts"
import { ref } from "vue"

// One component for the leak specs, picked with ?component=, and a button
// that mounts and unmounts it. The scroll area hides its scrollbars soon after
// the pointer leaves, so the spec sees them show and hide without waiting long.
const items = perfItems(3)
const lines = perfItems(30)
const component = leakComponent()
const mounted = ref(true)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <template v-if="mounted">
      <Menu v-if="component === 'menu'">
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent class="popup">
          <MenuItem
            v-for="item in items"
            :key="item.value"
            class="item"
            :value="item.value"
          >
            {{ item.label }}
          </MenuItem>
        </MenuContent>
      </Menu>
      <Select
        v-else-if="component === 'select'"
        :default-value="items[0].value"
      >
        <SelectTrigger aria-label="Open" class="trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent class="popup list-popup">
          <SelectItem
            v-for="item in items"
            :key="item.value"
            class="item"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Combobox v-else-if="component === 'combobox'">
        <ComboboxInput aria-label="Open" class="input" />
        <ComboboxContent class="popup list-popup">
          <ComboboxList>
            <ComboboxItem
              v-for="item in items"
              :key="item.value"
              class="item"
              :value="item.value"
              :label="item.label"
            >
              {{ item.label }}
            </ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Autocomplete v-else-if="component === 'autocomplete'">
        <AutocompleteInput aria-label="Open" class="input" />
        <AutocompleteContent class="popup list-popup">
          <AutocompleteList>
            <AutocompleteItem
              v-for="item in items"
              :key="item.value"
              class="item"
              :value="item.label"
            >
              {{ item.label }}
            </AutocompleteItem>
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      <Popover v-else-if="component === 'popover'">
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent class="popup" aria-label="Details">
          Details.
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
      <Dialog v-else-if="component === 'dialog'">
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent class="dialog">
          <DialogTitle class="title">Delete it?</DialogTitle>
          <DialogDescription class="description"
            >This can't be undone.</DialogDescription
          >
          <DialogClose>Cancel</DialogClose>
        </DialogContent>
      </Dialog>
      <Drawer v-else-if="component === 'drawer'">
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerBackdrop class="backdrop" />
        <DrawerContent class="dialog">
          <DrawerTitle class="title">Move goal</DrawerTitle>
          <DrawerDescription class="description"
            >Set your daily goal.</DrawerDescription
          >
          <DrawerClose>Cancel</DrawerClose>
        </DrawerContent>
      </Drawer>
      <HoverCard v-else-if="component === 'hover-card'" :delay="0">
        <HoverCardTrigger href="#profile">Open</HoverCardTrigger>
        <HoverCardContent class="hover-card-content"
          >A profile.</HoverCardContent
        >
      </HoverCard>
      <Slider
        v-else-if="component === 'slider'"
        name="volume"
        :default-value="50"
      >
        <SliderControl class="slider-control">
          <SliderTrack class="slider-track">
            <SliderIndicator class="slider-indicator" />
            <SliderThumb class="slider-thumb" aria-label="Volume" />
          </SliderTrack>
        </SliderControl>
      </Slider>
      <Accordion v-else-if="component === 'accordion'">
        <AccordionItem value="first">
          <AccordionHeader>
            <AccordionTrigger class="accordion-trigger">Open</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel class="accordion-panel">An answer.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="second">
          <AccordionHeader>
            <AccordionTrigger class="accordion-trigger"
              >Second</AccordionTrigger
            >
          </AccordionHeader>
          <AccordionPanel class="accordion-panel"
            >Another answer.</AccordionPanel
          >
        </AccordionItem>
      </Accordion>
      <Collapsible v-else-if="component === 'collapsible'">
        <CollapsibleTrigger>Open</CollapsibleTrigger>
        <CollapsiblePanel class="collapsible-panel">Details.</CollapsiblePanel>
      </Collapsible>
      <Tabs
        v-else-if="component === 'tabs'"
        class="tabs"
        :default-value="items[0].value"
      >
        <TabsList class="tablist" aria-label="Pages">
          <TabsTab
            v-for="item in items"
            :key="item.value"
            class="tab"
            :value="item.value"
          >
            {{ item.label }}
          </TabsTab>
          <TabsIndicator class="indicator" />
        </TabsList>
        <TabsPanel
          v-for="item in items"
          :key="item.value"
          class="panel"
          :value="item.value"
        >
          {{ item.label }} content.
        </TabsPanel>
      </Tabs>
      <Toolbar
        v-else-if="component === 'toolbar'"
        class="toolbar"
        aria-label="Formatting"
      >
        <ToolbarButton v-for="item in items" :key="item.value">{{
          item.label
        }}</ToolbarButton>
      </Toolbar>
      <Tree
        v-else-if="component === 'tree'"
        class="tree"
        aria-label="Files"
        :items="leakTreeItems()"
      />
      <Waterfall
        v-else-if="component === 'waterfall'"
        class="waterfall"
        aria-label="Trace"
        :items="leakWaterfallItems()"
      />
      <Resizable v-else-if="component === 'resizable'" class="resizable">
        <ResizablePanel id="first" :default-size="50" class="resizable-panel" />
        <ResizableHandle class="resizable-handle" aria-label="Handle" />
        <ResizablePanel
          id="second"
          :default-size="50"
          class="resizable-panel"
        />
      </Resizable>
      <ScrollArea
        v-else-if="component === 'scroll-area'"
        class="scroll-area"
        :scroll-hide-delay="50"
      >
        <ScrollAreaViewport
          class="scroll-area-viewport"
          role="region"
          aria-label="Items"
        >
          <ScrollAreaContent>
            <p v-for="line in lines" :key="line.value" class="scroll-area-item">
              {{ line.label }}
            </p>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar class="scroll-area-scrollbar">
          <ScrollAreaThumb class="scroll-area-thumb" />
        </ScrollAreaScrollbar>
      </ScrollArea>
      <Tooltip v-else>
        <TooltipTrigger>Open</TooltipTrigger>
        <TooltipContent class="tooltip">A hint.</TooltipContent>
      </Tooltip>
    </template>
    <button @click="mounted = !mounted">Toggle</button>
  </div>
</template>
