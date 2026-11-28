import { Component, computed, inject, input } from "@angular/core"
import {
  Command,
  type CommandAction,
  type CommandData,
  type CommandDataItem,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandPage,
  CommandSeparator,
  CommandShortcut,
  CommandStatus,
  type CommandValueChange,
} from "@ui-sdk/angular/command"
import {
  commandData,
  commandFixture,
  commandOptions,
  runAction,
} from "../../../../../tests/fixtures/command"
import { longItems } from "../../../../../tests/fixtures/select"
import { DATA, mountAngular, state } from "../../angular-mount"

type FixtureItem = {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
  shortcut?: string
  page?: string
}

type Entry =
  | ({ type: "item"; key: string } & CommandDataItem)
  | { type: "group"; key: string; label?: string; items: CommandData }
  | { type: "separator"; key: string }

function entryOf(entry: CommandData[number], index: number): Entry {
  if (typeof entry === "string") {
    return { type: "item", key: entry, value: entry, label: entry }
  }
  if (!("type" in entry)) {
    return { type: "item", key: entry.value, ...entry }
  }
  if (entry.type === "separator") {
    return { type: "separator", key: `separator-${index}` }
  }
  return {
    type: "group",
    key: `group-${entry.label ?? index}`,
    label: entry.label,
    items: entry.items,
  }
}

// The data's commands, groups and separators, styled like the composed ones.
@Component({
  selector: "[fixtureCommands]",
  host: { style: "display: contents" },
  imports: [
    CommandGroup,
    CommandGroupLabel,
    CommandItem,
    CommandItemText,
    CommandSeparator,
    CommandShortcut,
  ],
  template: `
    @for (entry of listed(); track entry.key) {
      @switch (entry.type) {
        @case ("separator") {
          <div uiCommandSeparator class="separator"></div>
        }
        @case ("group") {
          <div uiCommandGroup>
            @if (entry.label) {
              <div uiCommandGroupLabel class="label">{{ entry.label }}</div>
            }
            <div
              [fixtureCommands]="entry.items"
              [highlight]="highlight()"
            ></div>
          </div>
        }
        @case ("item") {
          <div
            uiCommandItem
            class="item"
            [value]="entry.value"
            [label]="entry.label"
            [keywords]="entry.keywords"
            [disabled]="entry.disabled"
            [shortcut]="entry.shortcut"
          >
            @if (highlight()) {
              <span uiCommandItemText>{{ entry.label }}</span>
            } @else {
              {{ entry.label }}
            }
            @if (entry.shortcut) {
              <span uiCommandShortcut class="shortcut"></span>
            }
          </div>
        }
      }
    }
  `,
})
class Commands {
  readonly entries = input.required<CommandData>({ alias: "fixtureCommands" })
  readonly highlight = input(false)
  protected readonly listed = computed(() => this.entries().map(entryOf))
}

@Component({
  imports: [
    Command,
    CommandEmpty,
    CommandGroup,
    CommandGroupLabel,
    CommandInput,
    CommandItem,
    CommandItemText,
    CommandList,
    CommandPage,
    CommandSeparator,
    CommandShortcut,
    CommandStatus,
    Commands,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiCommand
        class="command"
        [items]="items"
        [defaultValue]="options.defaultValue"
        [defaultPages]="options.defaultPages"
        [autoHighlight]="options.autoHighlight"
        [filter]="options.filter"
        [status]="options.status"
        (action)="onAction($event)"
        (beforeValueChange)="onValueChange($event)"
      >
        <input uiCommandInput class="input" [attr.aria-label]="f.input" />
        <div uiCommandEmpty class="empty">{{ f.empty }}</div>
        <div
          uiCommandStatus
          #status="uiCommandStatus"
          class="status"
          [textContent]="status.state().loading ? 'Loading…' : ''"
        ></div>
        <div uiCommandList #list="uiCommandList" class="command-list">
          @if (items) {
            <div
              [fixtureCommands]="list.state().items"
              [highlight]="options.highlight"
            ></div>
          } @else {
            <ng-container *uiCommandPage>
              @for (group of groups; track group.label; let index = $index) {
                @if (index > 0) {
                  <div uiCommandSeparator class="separator"></div>
                }
                <div uiCommandGroup>
                  <div uiCommandGroupLabel class="label">{{ group.label }}</div>
                  @for (item of group.items; track item.value) {
                    <div
                      uiCommandItem
                      class="item"
                      [value]="options.unvalued ? undefined : item.value"
                      [keywords]="item.keywords"
                      [disabled]="item.disabled"
                      [shortcut]="item.shortcut"
                      [page]="item.page"
                    >
                      @if (options.highlight) {
                        <span uiCommandItemText>{{ item.label }}</span>
                      } @else {
                        {{ item.label }}
                      }
                      @if (item.shortcut) {
                        <span uiCommandShortcut class="shortcut"></span>
                      }
                    </div>
                  }
                </div>
              }
            </ng-container>
            <ng-container *uiCommandPage="'theme'">
              @for (item of f.theme; track item.value) {
                <div uiCommandItem class="item" [value]="item.value">
                  {{ item.label }}
                </div>
              }
            </ng-container>
          }
        </div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Last highlight">{{
        lastHighlight()
      }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = commandFixture
  readonly groups: { label: string; items: FixtureItem[] }[] =
    commandFixture.groups
  readonly options: ReturnType<typeof commandOptions> & {
    defaultValue?: string
    defaultPages?: string[]
    autoHighlight?: boolean
    filter?: "contains" | "startsWith" | "fuzzy"
    status?: "loading"
  } = commandOptions()
  readonly items = this.options.long
    ? longItems()
    : inject(DATA)
      ? commandData()
      : undefined
  readonly action = state("")
  readonly lastHighlight = state("")

  onAction(action: CommandAction) {
    this.action.set(`action:${action.value}`)
    const pending = runAction(this.options.slow, this.options.fail)
    if (pending) {
      action.waitUntil(pending)
    }
  }

  onValueChange(change: CommandValueChange) {
    this.lastHighlight.set(`${change.value}:${change.reason}`)
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Commands, Fixture, mount }
