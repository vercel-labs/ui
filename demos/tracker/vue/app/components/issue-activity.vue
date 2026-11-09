<script setup lang="ts">
import { fromText } from "@ui-sdk/vue/token-input"
import { cn } from "cn"
import { type Issue, people, personOf } from "tracker-data"
import { ref } from "vue"
import Mention from "~/components/mention.vue"
import { Avatar } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
} from "~/components/ui/token-input"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "~/components/ui/trigger-menu"
import { addComment } from "~/composables/issues"

const props = defineProps<{ issue: Issue }>()

const mentions = people.map((person) => ({
  value: person.id,
  label: person.name,
  keywords: [person.role],
}))
const date = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
})

const pending = ref(false)

async function comment(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  pending.value = true
  if (await addComment(props.issue.id, new FormData(form))) {
    form.reset()
  }
  pending.value = false
}
</script>

<template>
  <Collapsible default-open class="grid gap-3">
    <CollapsibleTrigger class="-ms-1.5 w-fit">
      Activity
      <span class="text-muted-foreground tabular-nums">{{
        issue.comments.length
      }}</span>
    </CollapsibleTrigger>
    <CollapsiblePanel>
      <div :class="cn('grid gap-5', issue.comments.length > 0 && 'pt-1')">
        <ul v-if="issue.comments.length > 0" class="grid gap-5">
          <li v-for="item in issue.comments" :key="item.id" class="flex gap-3">
            <Avatar
              :name="personOf(item.author)?.name ?? 'Unknown'"
              decorative
            />
            <div class="grid min-w-0 flex-1 gap-1">
              <p class="flex items-baseline gap-2">
                <span class="font-medium">{{
                  personOf(item.author)?.name
                }}</span>
                <time
                  :datetime="item.createdAt"
                  class="text-xs text-muted-foreground"
                >
                  {{ date.format(new Date(item.createdAt)) }}
                </time>
              </p>
              <div class="leading-relaxed whitespace-pre-wrap">
                <template
                  v-for="(segment, index) in fromText(item.body)"
                  :key="index"
                  ><template v-if="typeof segment === 'string'">{{
                    segment
                  }}</template
                  ><Mention v-else :id="segment.value" :label="segment.label"
                /></template>
              </div>
            </div>
          </li>
        </ul>
        <form class="grid gap-2" @submit.prevent="comment">
          <TokenInput name="body" submit-shortcut="mod+enter">
            <TokenInputEditor
              aria-label="Comment"
              placeholder="Leave a comment, type @ to mention someone"
            />
            <TriggerMenu
              :triggers="[{ char: '@', type: 'mention', items: mentions }]"
            >
              <TriggerMenuContent>
                <TriggerMenuList v-slot="{ state }">
                  <TriggerMenuItem
                    v-for="item in state.items as typeof mentions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  >
                    <Avatar :name="item.label" size="sm" decorative />
                    {{ item.label }}
                  </TriggerMenuItem>
                </TriggerMenuList>
              </TriggerMenuContent>
            </TriggerMenu>
            <template #token="{ token }">
              <TokenInputToken>@{{ token.label }}</TokenInputToken>
            </template>
          </TokenInput>
          <div class="flex items-center justify-end gap-3">
            <span class="text-xs text-muted-foreground"
              >⌘ or Ctrl + Enter to send</span
            >
            <Button type="submit" size="sm" :disabled="pending">{{
              pending ? "Sending…" : "Comment"
            }}</Button>
          </div>
        </form>
      </div>
    </CollapsiblePanel>
  </Collapsible>
</template>
