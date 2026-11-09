import "@ui-sdk/web/scroll-area"
import {
  scrollAreaFixture,
  scrollAreaOptions,
} from "tests/fixtures/scroll-area.ts"

const { tags, gallery, short, chat } = scrollAreaFixture

const scrollbar = (orientation = "vertical") => `
  <ui-scroll-area-scrollbar class="scroll-area-scrollbar" orientation="${orientation}">
    <ui-scroll-area-thumb class="scroll-area-thumb"></ui-scroll-area-thumb>
  </ui-scroll-area-scrollbar>`

const viewport = (label: string, content: string, contentClass = "") => `
  <ui-scroll-area-viewport class="scroll-area-viewport" role="region" aria-label="${label}">
    <ui-scroll-area-content class="${contentClass}">${content}</ui-scroll-area-content>
  </ui-scroll-area-viewport>`

const items = (list: string[]) =>
  list.map((item) => `<p class="scroll-area-item">${item}</p>`).join("")
const message = (text: string) => `<p class="scroll-area-message">${text}</p>`

function mount(root: HTMLElement) {
  const { native, type, scrollHideDelay } = scrollAreaOptions()
  const template = document.createElement("template")
  template.innerHTML = `
    <div class="fixture scroll-fixture">
      <button>Before</button>
      <ui-scroll-area class="scroll-area">
        ${viewport(tags.label, items(tags.items))}
        ${native ? "" : scrollbar()}
      </ui-scroll-area>
      <ui-scroll-area class="scroll-area is-wide">
        ${viewport(gallery.label, gallery.items.map((item) => `<a href="#${item}">${item}</a>`).join(""), "scroll-area-grid")}
        ${scrollbar()}
        ${scrollbar("horizontal")}
        <ui-scroll-area-corner class="scroll-area-corner"></ui-scroll-area-corner>
      </ui-scroll-area>
      <ui-scroll-area class="scroll-area">
        ${viewport(short.label, items(short.items))}
        ${scrollbar()}
      </ui-scroll-area>
      <ui-scroll-area class="scroll-area is-chat" stick-to-end>
        ${viewport(chat.label, chat.messages.map(message).join(""))}
        ${scrollbar()}
        <ui-scroll-area-scroll-to-end class="scroll-area-end"><button>${chat.jump}</button></ui-scroll-area-scroll-to-end>
      </ui-scroll-area>
      <button id="add">Add message</button>
      <button id="stream">Stream</button>
      <button id="image">Add image</button>
      <button id="load">Load images</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <div class="scroll-fixture-spacer"></div>
    </div>
  `
  // URL options go in as attributes, never as markup, so a crafted URL can't add elements.
  for (const area of template.content.querySelectorAll("ui-scroll-area")) {
    if (type) {
      area.setAttribute("type", type)
    }
    if (scrollHideDelay !== undefined) {
      area.setAttribute("scroll-hide-delay", String(scrollHideDelay))
    }
  }
  root.replaceChildren(template.content)
  const content = root.querySelector(
    `[aria-label="${chat.label}"] ui-scroll-area-content`
  )!
  const button = (id: string) =>
    root.querySelector<HTMLButtonElement>(`#${id}`)!
  const add = (html: string) => content.insertAdjacentHTML("beforeend", html)
  button("add").addEventListener("click", () =>
    add(message(`Message ${content.children.length + 1}`))
  )
  button("stream").addEventListener("click", () =>
    content.lastElementChild!.append(chat.streamed)
  )
  button("image").addEventListener("click", () =>
    add(
      `<p class="scroll-area-message">Message ${content.children.length + 1}<span role="img" aria-label="Image" style="display:block;height:0"></span></p>`
    )
  )
  button("load").addEventListener("click", () => {
    for (const image of content.querySelectorAll<HTMLElement>('[role="img"]')) {
      image.style.height = `${chat.imageHeight}px`
    }
  })
}

export { mount }
