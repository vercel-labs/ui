<script setup lang="ts">
import { CheckIcon, ChevronRightIcon, ClockIcon, CodeIcon, FileIcon, PlusIcon, XIcon } from "@lucide/vue"
import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  type TokenInputValue,
  createTokenInputController,
  toText,
} from "@ui-sdk/vue/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuHint,
  TriggerMenuItem,
  TriggerMenuList,
  type TriggerMenuSelectDetails,
} from "@ui-sdk/vue/trigger-menu"
import { onBeforeUnmount, ref } from "vue"

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

const skills = [
  { value: "search", label: "search", arguments: [{ name: "query", hint: "<query>", required: true }] },
  { value: "review", label: "review" },
  { value: "summarize", label: "summarize" },
]

const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

const prompt = createTokenInputController()
const sent = ref<string[]>([])
const running = ref(false)
let sendTimer: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => clearTimeout(sendTimer))

function send(value: TokenInputValue) {
  if (running.value || !prompt.getLabel().trim()) return
  running.value = true
  const skillTokens = value.filter((segment) => typeof segment !== "string" && segment.type === "skill")
  for (const skill of skillTokens)
    if (typeof skill !== "string") prompt.updateToken(skill.id!, { data: { ...skill.data, run: "running" } })
  sendTimer = setTimeout(() => {
    for (const skill of skillTokens)
      if (typeof skill !== "string") prompt.updateToken(skill.id!, { data: { ...skill.data, run: "done" } })
    sent.value = [...sent.value, toText(prompt.getValue())]
    prompt.clear()
    running.value = false
  }, 1500)
}

const onSelect = (value: string, details: TriggerMenuSelectDetails<string>) =>
  details.trigger === "@" ? loadFile() : undefined

function attachReadme() {
  prompt.insert({ type: "file", value: "README.md", label: "README.md" }, { resolve: loadFile() })
}
</script>

<template>
  <div data-slot="stack">
    <ul>
      <li v-for="(text, index) in sent" :key="index">{{ text }}</li>
    </ul>
    <TokenInput :controller="prompt" :on-submit="send">
      <div data-slot="card">
        <TokenInputEditor aria-label="Prompt" placeholder="Ask anything. @ adds a file, / runs a skill" />
        <div data-slot="row">
          <button type="button" @mousedown.prevent @click="attachReadme">
            <PlusIcon aria-hidden="true" />
            README
          </button>
          <button
            type="button"
            :aria-label="running ? 'Running' : 'Send'"
            :disabled="running"
            @click="send(prompt.getValue())"
          >
            <ClockIcon aria-hidden="true" v-if="running" />
            <ChevronRightIcon aria-hidden="true" v-else />
          </button>
        </div>
      </div>
      <TriggerMenu
        :triggers="[
          { char: '@', type: 'file', items: files },
          { char: '/', boundary: 'start', type: 'skill', items: skills },
        ]"
        :on-select="onSelect"
      >
        <TriggerMenuHint />
        <TriggerMenuContent>
          <TriggerMenuEmpty>No matches</TriggerMenuEmpty>
          <TriggerMenuList v-slot="{ state }">
            <TriggerMenuItem
              v-for="item in state.items as TriggerMenuDataItem[]"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            >
              {{ item.label }}
            </TriggerMenuItem>
          </TriggerMenuList>
        </TriggerMenuContent>
      </TriggerMenu>
      <template #token="{ token }">
        <TokenInputToken>
          <CodeIcon aria-hidden="true" v-if="token.type === 'skill'" />
          <FileIcon aria-hidden="true" v-else />
          {{ token.type === "skill" ? `/${token.label}` : token.label }}
          <ClockIcon aria-hidden="true" v-if="token.data?.run === 'running'" />
          <CheckIcon aria-hidden="true" v-if="token.data?.run === 'done'" />
          <TokenInputTokenRemove>
            <XIcon aria-hidden="true" />
          </TokenInputTokenRemove>
        </TokenInputToken>
      </template>
    </TokenInput>
  </div>
</template>
