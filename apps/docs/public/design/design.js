const root = document.documentElement

for (const template of document.querySelectorAll(".ds-example > template")) {
  const example = template.parentElement
  const preview = document.createElement("div")
  preview.className = "ds-preview"
  if (example.dataset.layout) {
    preview.dataset.layout = example.dataset.layout
  }
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
  const indent = Math.min(
    ...lines
      .filter((line) => line.trim())
      .map((line) => line.match(/^ */)[0].length)
  )
  return lines.map((line) => line.slice(indent)).join("\n")
}

document
  .getElementById("ds-scheme")
  .addEventListener("pressedchange", (event) => {
    root.dataset.scheme = event.detail.value ? "dark" : "light"
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.content = event.detail.value ? "#0a0a0a" : "#ffffff"
    }
    refresh()
  })

const probe = document.createElement("div")
probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none"
document.body.append(probe)

function resolveColor(token) {
  probe.style.backgroundColor = `var(${token})`
  const value = getComputedStyle(probe).backgroundColor
  const numbers = value.match(/[\d.]+/g).map(Number)
  const [l, c, h, a = 1] = value.startsWith("oklch")
    ? numbers
    : toOklch(...numbers)
  const round = (number, digits) => +number.toFixed(digits)
  const color =
    c < 0.0005
      ? `${round(l, 3)} 0 0`
      : `${round(l, 3)} ${round(c, 3)} ${round(h, 1)}`
  return a < 1 ? `oklch(${color} / ${round(a, 2)})` : `oklch(${color})`
}

function toOklch(r, g, b, a) {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const x = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const y = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    Math.hypot(x, y),
    ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360,
    a,
  ]
}

function refresh() {
  requestAnimationFrame(() => {
    for (const swatch of document.querySelectorAll("[data-color]")) {
      swatch.textContent = resolveColor(swatch.dataset.color)
    }
    for (const measure of document.querySelectorAll("[data-measure]")) {
      const [selector, property] = measure.dataset.measure.split("|")
      const target = document.querySelector(selector)
      if (!target) {
        continue
      }
      const value = getComputedStyle(target)[property]
      measure.textContent =
        property === "borderRadius" && parseFloat(value) > 100 ? "full" : value
    }
  })
}

customElements.whenDefined("ui-slider").then(refresh)
addEventListener("load", refresh)

customElements.whenDefined("ui-trigger-menu").then(() => {
  for (const menu of document.querySelectorAll(
    "ui-trigger-menu[data-mentions]"
  )) {
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

const tags = new Set(
  [...document.querySelectorAll("*")].map((element) => element.localName)
)
const defined = [...tags]
  .filter((tag) => tag.startsWith("ui-"))
  .map((tag) => customElements.whenDefined(tag))
Promise.race([
  Promise.all(defined),
  new Promise((resolve) => setTimeout(resolve, 3000)),
]).then(() =>
  requestAnimationFrame(() => {
    refresh()
    root.dataset.ready = ""
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    }
  })
)
