// @vitest-environment jsdom
// A template ref on the element a `#render` slot returns gets it, and the part
// stays bound, whichever side of `v-bind` the ref is written.
import * as Vue from "vue"
import { compileTemplate } from "vue/compiler-sfc"
import {
  createApp,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  type App,
} from "vue"
import { afterEach, expect, test } from "vitest"
import { Listbox, ListboxItem } from "../src/listbox"

Element.prototype.scrollIntoView ??= function () {}

let app: App | undefined
afterEach(() => {
  app?.unmount()
  app = undefined
  document.body.replaceChildren()
})

const settle = async () => {
  await nextTick()
  await new Promise((done) => setTimeout(done, 20))
}

const compile = (source: string) =>
  new Function(
    "Vue",
    compileTemplate({
      source,
      filename: "fruit.vue",
      id: "fruit",
      compilerOptions: { mode: "function" },
    }).code
  )(Vue)

const ForwardingListbox = defineComponent({
  components: { Listbox },
  render: compile(`
    <Listbox v-bind="$attrs">
      <template v-for="(_, name) in $slots" #[name]="scope">
        <slot :name="name" v-bind="scope ?? {}" />
      </template>
    </Listbox>`),
})

async function mountListbox(root: string, close = "</div>", tag = "Listbox") {
  const list = ref<HTMLElement | null>(null)
  const extra = ref(0)
  let mounted: HTMLElement | null = null
  const el = document.body.appendChild(document.createElement("div"))
  app = createApp({
    components: { Listbox, ListboxItem, ForwardingListbox },
    setup() {
      onMounted(() => (mounted = list.value))
      return { list, extra }
    },
    render: compile(`
      <${tag} aria-label="Fruit" default-value="apple">
        <template #render="{ props }">
          ${root}
            <ListboxItem value="apple">Apple</ListboxItem>
            <ListboxItem value="pear">Pear</ListboxItem>
            <ListboxItem v-for="n in extra" :key="n" :value="'fig' + n">Fig</ListboxItem>
          ${close}
        </template>
      </${tag}>`),
  })
  app.mount(el)
  await settle()
  const press = async () => {
    document.activeElement!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await settle()
  }
  const options = () => [
    ...document.querySelectorAll<HTMLElement>('[role="option"]'),
  ]
  options()[0].focus()
  await press()
  return {
    listbox: document.querySelector('[role="listbox"]'),
    mounted,
    options,
    press,
    extra,
  }
}

test.each([
  ['<div ref="list" v-bind="props">'],
  ['<div v-bind="props" ref="list">'],
])("%s gets the element and keeps the part bound", async (root) => {
  const { listbox, mounted, options, press, extra } = await mountListbox(root)
  expect(mounted).toBe(listbox)
  expect(document.activeElement).toBe(options()[1])
  extra.value = 1
  await settle()
  await press()
  expect(document.activeElement).toBe(options()[2])
})

test("the part binds through a #render slot another component passes on", async () => {
  const { listbox, mounted, options } = await mountListbox(
    '<div v-bind="props" ref="list">',
    "</div>",
    "ForwardingListbox"
  )
  expect(mounted).toBe(listbox)
  expect(document.activeElement).toBe(options()[1])
})

test("the part binds to its element beside others in a fragment or a teleport", async () => {
  for (const [root, close] of [
    [
      '<template v-if="true"><span>Fruit</span><div v-bind="props" ref="list">',
      "</div></template>",
    ],
    [
      '<Teleport to="body"><div v-bind="props" ref="list">',
      "</div></Teleport>",
    ],
  ]) {
    const { listbox, mounted, options } = await mountListbox(root, close)
    expect(mounted).toBe(listbox)
    expect(document.activeElement).toBe(options()[1])
    app?.unmount()
    app = undefined
    document.body.replaceChildren()
  }
})
