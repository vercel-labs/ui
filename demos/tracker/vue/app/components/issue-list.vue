<script setup lang="ts">
import { Ellipsis, Inbox, Trash2, X } from "@lucide/vue"
import {
  formatDate,
  href,
  type Issue,
  type Priority,
  priorities,
  type Query,
  type Status,
  statuses,
  statusOf,
} from "tracker-data"
import Assignee from "~/components/assignee.vue"
import IssueLabels from "~/components/issue-labels.vue"
import PriorityIcon from "~/components/priority-icon.vue"
import StatusIcon from "~/components/status-icon.vue"
import { buttonVariants } from "~/components/ui/button"
import { Checkbox, CheckboxGroup } from "~/components/ui/checkbox"
import {
  createMenuController,
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "~/components/ui/menu"
import { Pagination } from "~/components/ui/pagination"
import { ScrollArea } from "~/components/ui/scroll-area"
import { toast } from "~/components/ui/toast"
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from "~/components/ui/toolbar"

const props = defineProps<{ issues: Issue[]; query: Query; pageSize: number }>()

const { confirm } = useTracker()
const menu = createMenuController<Issue>()
const selected = ref<string[]>([])
const head = ref<HTMLElement>()

const pageCount = computed(() =>
  Math.max(1, Math.ceil(props.issues.length / props.pageSize))
)
const page = computed(() => Math.min(props.query.page, pageCount.value))
const rows = computed(() =>
  props.issues.slice(
    (page.value - 1) * props.pageSize,
    page.value * props.pageSize
  )
)
const latest = (payload: Issue) =>
  props.issues.find((issue) => issue.id === payload.id) ?? payload
const checked = computed({
  get: () =>
    selected.value.filter((id) => rows.value.some((issue) => issue.id === id)),
  set: (next) => (selected.value = next),
})

function plural(count: number) {
  return count === 1 ? "1 issue" : `${count} issues`
}

async function setStatus(ids: string[], status: Status) {
  if (!(await updateIssues(ids, { status }))) {
    return
  }
  toast(
    `${ids.length === 1 ? ids[0] : plural(ids.length)} moved to ${statusOf(status).label}`
  )
}

async function remove(ids: string[]) {
  const yes = await confirm({
    title: `Delete ${ids.length === 1 ? ids[0] : plural(ids.length)}?`,
    description: "Deleted issues and their comments can't be brought back.",
    confirmLabel: "Delete",
  })
  if (!yes) {
    return
  }
  if (!(await deleteIssues(ids))) {
    return
  }
  selected.value = []
  if (props.query.issue && ids.includes(props.query.issue)) {
    await navigateTo(href(props.query, { issue: null }))
  }
  toast.success(`${plural(ids.length)} deleted`)
  await nextTick()
  head.value?.querySelector("button")?.focus()
}

async function run(action: string) {
  const issue = menu.getPayload()
  if (!issue) {
    return
  }
  if (action === "open") {
    navigateTo(href(props.query, { issue: issue.id }))
  }
  if (action === "copy") {
    await navigator.clipboard.writeText(issue.id)
    toast(`Copied ${issue.id}`)
  }
  if (action === "delete") {
    remove([issue.id])
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <CheckboxGroup
      v-model="checked"
      aria-label="Issues"
      :all-values="rows.map((issue) => issue.id)"
      class="flex min-h-0 flex-1 flex-col"
    >
      <div
        ref="head"
        class="flex h-11 shrink-0 items-center gap-3 border-b border-border ps-4 pe-2"
      >
        <Checkbox
          parent
          aria-label="Select all issues on this page"
          :disabled="rows.length === 0"
        />
        <Toolbar
          v-if="checked.length > 0"
          aria-label="Selected issues"
          class="flex-1 gap-1"
        >
          <span class="me-2 text-sm font-medium"
            >{{ checked.length }} selected</span
          >
          <Menu
            @action="(status: string) => setStatus(checked, status as Status)"
          >
            <ToolbarButton
              :class="buttonVariants({ size: 'sm', variant: 'ghost' })"
            >
              <template #render="{ props: button }">
                <MenuTrigger v-bind="button">Set status</MenuTrigger>
              </template>
            </ToolbarButton>
            <MenuContent align="start">
              <MenuItem
                v-for="status in statuses"
                :key="status.value"
                :value="status.value"
              >
                <MenuItemIcon
                  ><StatusIcon :status="status.value"
                /></MenuItemIcon>
                {{ status.label }}
              </MenuItem>
            </MenuContent>
          </Menu>
          <ToolbarButton
            :class="buttonVariants({ size: 'sm', variant: 'ghost' })"
            @click="remove(checked)"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton
            aria-label="Clear selection"
            :class="buttonVariants({ size: 'icon-sm', variant: 'ghost' })"
            @click="selected = []"
          >
            <X aria-hidden="true" />
          </ToolbarButton>
        </Toolbar>
        <span v-else class="text-sm text-muted-foreground">{{
          plural(issues.length)
        }}</span>
      </div>
      <ScrollArea label="Issue list" class="flex-1">
        <div
          v-if="rows.length === 0"
          class="flex flex-col items-center gap-2 py-24 text-muted-foreground"
        >
          <Inbox aria-hidden="true" class="size-6" />
          No issues match these filters.
        </div>
        <ul v-else class="@container">
          <li
            v-for="issue in rows"
            :key="issue.id"
            :data-current="issue.id === query.issue || undefined"
            class="flex h-11 items-center gap-3 border-b border-border ps-4 pe-2 transition-colors hover:bg-muted/50 has-data-checked:bg-muted/70 data-current:bg-muted"
          >
            <Checkbox :value="issue.id" :aria-label="`Select ${issue.id}`" />
            <PriorityIcon :priority="issue.priority" label />
            <span
              class="hidden w-12 shrink-0 text-xs text-muted-foreground tabular-nums @md:block"
              >{{ issue.id }}</span
            >
            <StatusIcon :status="issue.status" label />
            <NuxtLink
              :to="href(query, { issue: issue.id })"
              :aria-current="issue.id === query.issue || undefined"
              class="min-w-0 flex-1 truncate rounded-md font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {{ issue.title }}
            </NuxtLink>
            <IssueLabels
              :labels="issue.labels"
              class="hidden shrink-0 gap-1 @3xl:flex"
            />
            <span
              v-if="issue.due"
              class="hidden w-12 shrink-0 text-end text-xs text-muted-foreground @lg:block"
            >
              {{ formatDate(issue.due) }}
            </span>
            <Assignee :id="issue.assignee" />
            <MenuTrigger
              :controller="menu"
              :payload="issue"
              :aria-label="`Actions for ${issue.id}`"
              :class="buttonVariants({ size: 'icon-sm', variant: 'ghost' })"
            >
              <Ellipsis aria-hidden="true" />
            </MenuTrigger>
          </li>
        </ul>
      </ScrollArea>
    </CheckboxGroup>
    <footer
      v-if="pageCount > 1"
      class="flex shrink-0 justify-center border-t border-border p-2"
    >
      <Pagination
        :page="page"
        :page-count="pageCount"
        :get-href="(page: number) => href(query, { page })"
      />
    </footer>
    <Menu :controller="menu" @action="run">
      <MenuContent v-slot="{ state }" align="end">
        <template v-if="state.payload">
          <MenuGroup>
            <MenuGroupLabel>{{ state.payload.id }}</MenuGroupLabel>
            <MenuItem value="open">Open</MenuItem>
            <MenuSub>
              <MenuSubTrigger>Status</MenuSubTrigger>
              <MenuSubContent>
                <MenuRadioGroup
                  :value="latest(state.payload).status"
                  @value-change="
                    (status: string) =>
                      setStatus([state.payload.id], status as Status)
                  "
                >
                  <MenuRadioItem
                    v-for="status in statuses"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </MenuRadioItem>
                </MenuRadioGroup>
              </MenuSubContent>
            </MenuSub>
            <MenuSub>
              <MenuSubTrigger>Priority</MenuSubTrigger>
              <MenuSubContent>
                <MenuRadioGroup
                  :value="latest(state.payload).priority"
                  @value-change="
                    (priority: string) =>
                      updateIssues([state.payload.id], {
                        priority: priority as Priority,
                      })
                  "
                >
                  <MenuRadioItem
                    v-for="priority in priorities"
                    :key="priority.value"
                    :value="priority.value"
                  >
                    {{ priority.label }}
                  </MenuRadioItem>
                </MenuRadioGroup>
              </MenuSubContent>
            </MenuSub>
            <MenuItem value="copy">Copy ID</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem value="delete" variant="destructive">Delete</MenuItem>
        </template>
      </MenuContent>
    </Menu>
  </div>
</template>
