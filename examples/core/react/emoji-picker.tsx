import * as React from "react"
import {
  announce,
  createRovingFocus,
  definePrimitive,
  dispatch,
  selects,
  spatialMove,
  type ChangeDetails,
} from "@ui-sdk/core"
import { fuzzyScore } from "@ui-sdk/core/text-match"
import { createParts } from "@ui-sdk/react/primitive"

type EmojiPickerOptions = {
  onPick?: (emoji: string, details: ChangeDetails<"item-press" | "search-enter">) => void
}

type EmojiPickerState = {
  query: string
  stop: string | null
  focused: string | null
  hovered: string | null
}

type EmojiPickerRootState = {
  query: string
  active: string | null
}

type EmojiProps = { value: string }

const emojiPicker = definePrimitive({
  name: "emoji-picker",
  options: { onPick: "callback" },
  state: (_options: EmojiPickerOptions): EmojiPickerState => ({
    query: "",
    stop: null,
    focused: null,
    hovered: null,
  }),
  api: (context) => {
    const { store } = context
    let searched = false
    const roving = createRovingFocus<EmojiPickerState, EmojiProps>(context, {
      slot: "emoji",
      key: "stop",
      move: spatialMove(),
      onItemsChange: () => {
        if (!searched) return
        const count = roving.items().length
        announce(count === 0 ? "No emoji found" : `${count} emoji`)
      },
    })
    const label = (emoji: string) => context.element("emoji", emoji)?.getAttribute("aria-label") ?? emoji

    const api = {
      roving,
      setHovered: (emoji: string | null) => store.set({ hovered: emoji }),
      setFocused: (emoji: string | null) => store.set({ focused: emoji }),
      search(query: string) {
        searched = true
        store.set({ query })
      },
      pick(emoji: string, reason: "item-press" | "search-enter", event?: Event) {
        dispatch(context, "onPick", emoji, { reason, event })
        announce(`Picked ${label(emoji)}`)
      },
      searchKeydown(event: KeyboardEvent) {
        const first = roving.items()[0]
        if (event.key === "ArrowDown" && first) {
          event.preventDefault()
          roving.focus(first.key)
        } else if (event.key === "Enter" && first) {
          event.preventDefault()
          api.pick(first.key, "search-enter", event)
        }
      },
      emojiKeydown(event: KeyboardEvent, el: HTMLElement) {
        const typing =
          event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey
        if (typing) context.element("search")?.focus()
        else roving.keydown(event, el)
      },
    }
    return api
  },
  slots: (slot) => ({
    root: slot<{}, EmojiPickerRootState>({
      state: (state) => ({ query: state.query, active: state.hovered ?? state.focused }),
    }),
    search: slot({
      attrs: (state) => ({ type: "search", value: state.query, autocomplete: "off" }),
      on: {
        input: (event, { api }) => api.search((event.target as HTMLInputElement).value),
        keydown: (event, { api }) => api.searchKeydown(event),
      },
    }),
    grid: slot({
      attrs: () => ({ role: "group" }),
      on: { pointerleave: (_event, { api }) => api.setHovered(null) },
    }),
    emoji: slot<EmojiProps>({
      props: { value: "string" },
      selects: selects({ stop: ({ key }) => [key, null] }),
      attrs: (state, part) => ({ type: "button", tabindex: part.api.roving.tabIndex(state, part) }),
      press: ({ api, key }, event) => api.pick(key, "item-press", event),
      on: {
        keydown: (event, { el, api }) => api.emojiKeydown(event, el!),
        pointerenter: (_event, { api, key }) => api.setHovered(key),
        focus: (_event, { api, key }) => api.setFocused(key),
        blur: (_event, { api }) => api.setFocused(null),
      },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
  }),
})

const parts = createParts(emojiPicker, { root: "div", search: "input", grid: "div", emoji: "button" })

const EmojiPicker = parts.Root

const EmojiPickerSearch = parts.Search

const EmojiPickerGrid = parts.Grid

const EmojiPickerEmoji = parts.Emoji

const emoji: [string, string, string][] = [
  ["😀", "grinning face", "smile happy"],
  ["😂", "face with tears of joy", "laugh lol"],
  ["🥹", "face holding back tears", "grateful touched"],
  ["😍", "smiling face with heart eyes", "love crush"],
  ["😎", "smiling face with sunglasses", "cool"],
  ["🤔", "thinking face", "hmm wonder"],
  ["🫡", "saluting face", "yes sir ok"],
  ["😴", "sleeping face", "tired zzz"],
  ["🥳", "partying face", "party celebrate birthday"],
  ["😭", "loudly crying face", "sad sob"],
  ["😤", "face with steam from nose", "proud determined"],
  ["🤯", "exploding head", "mind blown shocked"],
  ["👍", "thumbs up", "yes approve like"],
  ["👎", "thumbs down", "no dislike"],
  ["👏", "clapping hands", "applause bravo"],
  ["🙌", "raising hands", "hooray celebrate"],
  ["🙏", "folded hands", "please thanks"],
  ["💪", "flexed biceps", "strong"],
  ["👀", "eyes", "look see watching"],
  ["🫶", "heart hands", "love thanks"],
  ["❤️", "red heart", "love"],
  ["🔥", "fire", "hot lit"],
  ["✨", "sparkles", "magic new shiny"],
  ["⭐", "star", "favorite"],
  ["🎉", "party popper", "celebrate tada party"],
  ["🚀", "rocket", "ship launch fast"],
  ["✅", "check mark button", "done yes complete"],
  ["❌", "cross mark", "no wrong"],
  ["💯", "hundred points", "perfect score"],
  ["💡", "light bulb", "idea"],
  ["🐛", "bug", "insect issue"],
  ["🧪", "test tube", "experiment test"],
  ["📌", "pushpin", "pin important"],
  ["⏰", "alarm clock", "time late reminder"],
  ["☕", "hot beverage", "coffee tea"],
  ["🍕", "pizza", "food"],
  ["🌮", "taco", "food"],
  ["🍩", "doughnut", "donut food sweet"],
  ["🐶", "dog face", "puppy pet"],
  ["🐱", "cat face", "kitten pet"],
  ["🦄", "unicorn", "magic"],
  ["🌈", "rainbow", "pride colors"],
  ["☀️", "sun", "sunny weather"],
  ["🌧️", "cloud with rain", "rain weather"],
  ["🌊", "water wave", "ocean sea"],
  ["🌱", "seedling", "plant grow new"],
  ["🎯", "bullseye", "target goal"],
  ["🏆", "trophy", "win award"],
]

const names = Object.fromEntries(emoji.map(([value, name]) => [value, name]))

function search(query: string) {
  if (!query.trim()) return emoji
  return emoji
    .map((entry) => ({
      entry,
      score: Math.max(fuzzyScore(entry[1], query), fuzzyScore(entry[2], query) * 0.9),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry)
}

function Example() {
  const [picked, setPicked] = React.useState<string | null>(null)
  return (
    <EmojiPicker onPick={(value: string) => setPicked(value)}>
      {({ query, active }) => {
        const results = search(query)
        return (
          <>
            <EmojiPickerSearch aria-label="Search emoji" placeholder="Search emoji" />
            <EmojiPickerGrid aria-label="Emoji">
              {results.map(([value, name]) => (
                <EmojiPickerEmoji key={value} value={value} aria-label={name}>
                  {value}
                </EmojiPickerEmoji>
              ))}
              {results.length === 0 && <p data-slot="hint">No emoji found.</p>}
            </EmojiPickerGrid>
            <div data-footer data-slot="emoji-picker-footer">
              {active ? (
                <>
                  <span data-slot="emoji-picker-preview">{active}</span>
                  <span>{names[active]}</span>
                </>
              ) : picked ? (
                <>
                  <span data-slot="emoji-picker-preview">{picked}</span>
                  <span>Picked {names[picked]}</span>
                </>
              ) : (
                "Pick an emoji"
              )}
            </div>
          </>
        )
      }}
    </EmojiPicker>
  )
}

export {
  emojiPicker,
  EmojiPicker,
  EmojiPickerEmoji,
  EmojiPickerGrid,
  type EmojiPickerOptions,
  type EmojiPickerRootState,
  EmojiPickerSearch,
  type EmojiProps,
  Example,
}
