import { createTabsController } from "@ui-sdk/core/tabs"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/solid/tabs"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import { tabsOptions } from "tests/fixtures/page.ts"
import { tabsFixture } from "tests/fixtures/tabs.ts"

const controller = createTabsController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const { cancel, keepMounted, ...options } = tabsOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <Tabs
        class="tabs"
        controller={controller}
        {...options}
        onValueChange={(value, details) => {
          if (value === cancel) {
            return details.cancel()
          }
          setAction(value ?? "")
        }}
      >
        <TabsList class="tablist" aria-label={tabsFixture.label}>
          <For each={tabsFixture.tabs}>
            {(tab) => (
              <TabsTab class="tab" value={tab.value} disabled={tab.disabled}>
                {tab.label}
              </TabsTab>
            )}
          </For>
          <TabsIndicator class="indicator" />
        </TabsList>
        <For each={tabsFixture.tabs}>
          {(tab) => (
            <TabsPanel
              class="panel"
              value={tab.value}
              keepMounted={keepMounted}
            >
              {tab.content}
              <Show when={tab.field}>
                <label>
                  {" "}
                  {tab.field} <input type="password" />
                </label>
              </Show>
            </TabsPanel>
          )}
        </For>
      </Tabs>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.select("notifications")}>
        Show notifications
      </button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
