const root = document.documentElement

for (const template of document.querySelectorAll(".ds-example > template")) {
  const example = template.parentElement
  const preview = document.createElement("div")
  preview.className = "ds-preview"
  if (example.dataset.layout) preview.dataset.layout = example.dataset.layout
  preview.append(template.content.cloneNode(true))
  template.before(preview)
  if (example.dataset.caption) {
    const caption = document.createElement("div")
    caption.className = "ds-caption"
    caption.textContent = example.dataset.caption
    template.before(caption)
  }
  const source = document.createElement("div")
  source.className = "ds-source"
  source.innerHTML = `
    <ui-collapsible>
      <ui-collapsible-trigger><button type="button">Markup</button></ui-collapsible-trigger>
      <ui-collapsible-panel hidden><pre><code></code></pre></ui-collapsible-panel>
    </ui-collapsible>`
  source.querySelector("code").textContent = dedent(template.innerHTML)
  template.replaceWith(source)
}

function dedent(html) {
  const lines = html.replace(/^\n+|\s+$/g, "").split("\n")
  const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length))
  return lines.map((line) => line.slice(indent)).join("\n")
}

const sliders = [...document.querySelectorAll(".ds-tokens ui-slider")]

for (const slider of sliders) {
  slider.addEventListener("valuechange", (event) => {
    root.style.setProperty(slider.dataset.token, `${[].concat(event.detail.value)[0] / 16}rem`)
    refresh()
  })
}

document.getElementById("ds-scheme").addEventListener("pressedchange", (event) => {
  root.dataset.scheme = event.detail.value ? "dark" : "light"
  refresh()
})

document.getElementById("ds-dir").addEventListener("pressedchange", (event) => {
  root.dir = event.detail.value ? "rtl" : "ltr"
})

const probe = document.createElement("div")
probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none"
document.body.append(probe)

function resolveColor(token) {
  probe.style.backgroundColor = `var(${token})`
  const [r, g, b, a = 1] = getComputedStyle(probe)
    .backgroundColor.match(/[\d.]+/g)
    .map(Number)
  const hex = `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
  return a < 1 ? `${hex} at ${Math.round(a * 100)}%` : hex
}

function refresh() {
  requestAnimationFrame(() => {
    for (const swatch of document.querySelectorAll("[data-color]")) {
      swatch.textContent = resolveColor(swatch.dataset.color)
    }
    for (const measure of document.querySelectorAll("[data-measure]")) {
      const [selector, property] = measure.dataset.measure.split("|")
      const target = document.querySelector(selector)
      if (!target) continue
      const value = getComputedStyle(target)[property]
      measure.textContent = property === "borderRadius" && parseFloat(value) > 100 ? "full" : value
    }
  })
}

customElements.whenDefined("ui-slider").then(refresh)
addEventListener("load", refresh)

customElements.whenDefined("ui-trigger-menu").then(() => {
  for (const menu of document.querySelectorAll("ui-trigger-menu[data-mentions]")) {
    menu.triggers = [
      {
        char: "@",
        type: "mention",
        items: [
          { value: "hollis", label: "Hollis Grant" },
          { value: "ines", label: "Inès Moreau" },
          { value: "kofi", label: "Kofi Mensah" },
        ],
      },
    ]
  }
})

document.addEventListener("submit", (event) => event.preventDefault())
