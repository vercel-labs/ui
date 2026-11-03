import "@ui-sdk/web/trigger-menu"

const channels = ["general", "random", "design", "engineering", "marketing", "support"]

function searchChannels(query: string, { signal }: { signal: AbortSignal }) {
  return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
    const timer = setTimeout(
      () =>
        resolve(
          channels
            .filter((channel) => channel.includes(query.toLowerCase()))
            .map((channel) => ({ value: channel, label: channel })),
        ),
      400,
    )
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-trigger-menu>
      <div data-slot="stack">
        <ui-trigger-menu-input>
          <textarea aria-label="Message" placeholder="Type # to link a channel"></textarea>
        </ui-trigger-menu-input>
        <ui-trigger-menu-status></ui-trigger-menu-status>
      </div>
      <ui-trigger-menu-content>
        <ui-trigger-menu-empty>No channels found.</ui-trigger-menu-empty>
        <ui-trigger-menu-list></ui-trigger-menu-list>
      </ui-trigger-menu-content>
      <template>
        <ui-trigger-menu-item>
        </ui-trigger-menu-item>
      </template>
    </ui-trigger-menu>
  `
  const menu = root.querySelector("ui-trigger-menu")!
  menu.triggers = [{ char: "#", type: "channel", items: searchChannels }]
}

export { mount }
