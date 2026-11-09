import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/solid/tabs"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import { tabsOptions } from "tests/fixtures/page.ts"

function Fixture() {
  const [action, setAction] = createSignal("")
  const [reason, setReason] = createSignal("")
  const { activation } = tabsOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <Tabs
        class="tabs"
        defaultValue="overview"
        activation={activation}
        onValueChange={(value, details) => {
          setAction(value ?? "")
          setReason(details.reason)
        }}
      >
        <TabsList class="tablist" aria-label="Project">
          <TabsTab
            class="tab"
            value="overview"
            render={(props) => <a {...props} href="#overview" />}
          >
            Overview
          </TabsTab>
          <TabsTab
            class="tab"
            value="activity"
            render={(props) => <a {...props} href="#activity" />}
          >
            Activity
          </TabsTab>
          <TabsTab
            class="tab"
            value="watched"
            render={(props, state) => (
              <button {...props}>
                {props.children}
                {state.selected && <span aria-hidden="true"> •</span>}
              </button>
            )}
          >
            Watched
          </TabsTab>
          <TabsTab
            value="plain"
            class={(state) =>
              `tab ${state.selected ? "is-selected" : "is-unselected"}`
            }
          >
            Plain
          </TabsTab>
        </TabsList>
        <For each={["overview", "activity", "watched", "plain"]}>
          {(value) => (
            <TabsPanel class="panel" value={value}>
              The {value} panel.
            </TabsPanel>
          )}
        </For>
      </Tabs>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Reason">
        {reason()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
