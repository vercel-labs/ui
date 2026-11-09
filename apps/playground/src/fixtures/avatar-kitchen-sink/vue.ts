import type { ChangeDetails } from "@ui-sdk/core"
import type { AvatarState } from "@ui-sdk/core/avatar"
import { Avatar, AvatarFallback, AvatarImage } from "@ui-sdk/vue"
import {
  createApp,
  defineComponent,
  h,
  onScopeDispose,
  ref,
  type PropType,
} from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import {
  images,
  initialSource,
  sourceControls,
  statusMessage,
  type Person,
  type Source,
  type Variant,
} from "./variants"

type RenderSlot = { props: Record<string, unknown>; state: AvatarState }

const VariantAvatar = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    person: { type: Object as PropType<Person>, required: true },
    index: { type: Number, required: true },
    env: { type: Object as PropType<Env>, required: true },
  },
  setup({ variant, person, index, env }) {
    const source = ref<Source>(initialSource(variant, person, index))
    const isFirst = index === 0
    if (isFirst && variant.arrivesAfter && person.image) {
      const timer = setTimeout(
        () => (source.value = images[person.image!]),
        variant.arrivesAfter
      )
      onScopeDispose(() => clearTimeout(timer))
    }
    if (isFirst && variant.sources) {
      env.controls(
        sourceControls.map(([label, next]) => [
          label,
          () => void (source.value = next),
        ])
      )
    }

    // Vue takes the image's attributes in lowercase.
    const imageAttributes = () => ({
      class: variant.render === "image" ? classes.customImage : classes.image,
      src: source.value ?? undefined,
      alt: person.name,
      crossorigin: variant.imageProps?.crossOrigin,
      referrerpolicy: variant.imageProps?.referrerPolicy,
      srcset: variant.imageProps?.srcSet,
      sizes: variant.imageProps?.sizes,
    })
    const image = () =>
      source.value !== undefined &&
      h(
        AvatarImage,
        imageAttributes(),
        variant.render === "image"
          ? {
              render: ({ props }: RenderSlot) =>
                h("img", { ...props, "data-custom": "" }),
            }
          : undefined
      )
    const fallback = () =>
      h(
        AvatarFallback,
        { class: classes.fallback, delay: variant.delay },
        variant.render === "fallback"
          ? {
              default: ({ state }: { state: AvatarState }) =>
                state.loadingStatus,
            }
          : () => person.initials
      )

    return () =>
      h(
        Avatar,
        {
          class: `${classes.avatar} ${classes.sizes[variant.size ?? "md"]}`,
          debug: variant.debug,
          onLoadingStatusChange: (status: string, details: ChangeDetails) =>
            env.log(statusMessage(person, status, details.reason)),
        },
        variant.render === "root"
          ? {
              // A render slot draws the whole part, so it renders the image and the fallback too.
              render: ({ props, state }: RenderSlot) =>
                h(
                  "div",
                  { ...props, title: `Status: ${state.loadingStatus}` },
                  [image(), fallback()]
                ),
            }
          : () => [image(), fallback()]
      )
  },
})

const VariantAvatars = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true },
    env: { type: Object as PropType<Env>, required: true },
  },
  setup({ variant, env }) {
    return () => {
      const avatars = variant.people.map((person, index) =>
        h(VariantAvatar, { key: person.name, variant, person, index, env })
      )
      return variant.people.length > 1
        ? h("div", { class: classes.group }, avatars)
        : avatars
    }
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantAvatars, { variant, env }).mount(slot)
  )
}

export { mount }
