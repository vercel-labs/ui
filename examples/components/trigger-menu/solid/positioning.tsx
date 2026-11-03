import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/solid/trigger-menu"
import { For, createSignal } from "solid-js"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

function Example() {
  const [field, setField] = createSignal<HTMLTextAreaElement>()
  const [box, setBox] = createSignal<HTMLDivElement>()
  return (
    <TriggerMenu triggers={[{ char: "@", items: people }]}>
      <div data-slot="stack">
        <TriggerMenuInput
          ref={setField}
          aria-label="Comment"
          placeholder="The list opens above, at the field's start"
        />
        <div ref={setBox} />
      </div>
      <TriggerMenuContent
        side="top"
        align="start"
        sideOffset={8}
        alignOffset={-4}
        collisionPadding={16}
        anchor={field()}
        keepMounted
        container={box()}
      >
        <TriggerMenuList>
          {(state) => (
            <For each={state.items as TriggerMenuDataItem[]}>
              {(item) => (
                <TriggerMenuItem value={item.value} label={item.label} disabled={item.disabled}>
                  {item.label}
                </TriggerMenuItem>
              )}
            </For>
          )}
        </TriggerMenuList>
      </TriggerMenuContent>
    </TriggerMenu>
  )
}

export { Example }
