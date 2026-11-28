import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { useAsyncOptions } from "@ui-sdk/angular/async-options"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectList,
  SelectStatus,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

const countryList = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile" },
  { value: "cn", label: "China" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "gr", label: "Greece" },
  { value: "in", label: "India" },
  { value: "ie", label: "Ireland" },
  { value: "it", label: "Italy" },
  { value: "jp", label: "Japan" },
  { value: "mx", label: "Mexico" },
  { value: "nl", label: "Netherlands" },
  { value: "no", label: "Norway" },
  { value: "pt", label: "Portugal" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
]

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectEmpty,
    SelectInput,
    SelectItem,
    SelectItemIndicator,
    SelectList,
    SelectStatus,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Country</label>
      <ng-container
        uiSelect
        [items]="results.state().items"
        [filter]="false"
        [status]="results.state().status"
        [(query)]="query"
        (beforeQueryChange)="results.setQuery($event.value)"
        (loadMore)="results.loadMore()"
        placeholder="Select a country"
      >
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          <input
            uiSelectInput
            aria-label="Search countries"
            placeholder="Search countries…"
          />
          <div uiSelectEmpty #selectEmpty="uiSelectEmpty">
            @if (selectEmpty.state().empty && !selectEmpty.state().loading) {
              No countries match “{{ selectEmpty.state().query }}”.
            }
          </div>
          <div uiSelectList #selectList="uiSelectList">
            @for (item of itemsOf(selectList.state().items); track item.value) {
              <div
                uiSelectItem
                [value]="item.value"
                [label]="item.label"
                [disabled]="item.disabled"
              >
                {{ item.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
          <div uiSelectStatus #selectStatus="uiSelectStatus">
            {{ selectStatus.state().loading
                ? 'Loading…'
                : selectStatus.state().status === 'error'
                  ? 'Couldn't load countries.'
                  : selectStatus.state().count + ' shown' }}
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly countryList = countryList

  readonly searchCountries = (
    query: string,
    { signal, page }: { signal: AbortSignal; page: number }
  ) => {
    return new Promise<{ items: typeof countryList; hasMore: boolean }>(
      (resolve, reject) => {
        const timer = setTimeout(() => {
          const needle = query.trim().toLowerCase()
          const found = this.countryList.filter((country) =>
            country.label.toLowerCase().includes(needle)
          )
          resolve({
            items: found.slice(page * 6, page * 6 + 6),
            hasMore: found.length > page * 6 + 6,
          })
        }, 400)
        signal.addEventListener("abort", () => {
          clearTimeout(timer)
          reject(signal.reason)
        })
      }
    )
  }

  readonly query = signal("")

  readonly results = useAsyncOptions(this.searchCountries, { immediate: true })

  itemsOf(items: unknown) {
    return items as { value: string; label: string; disabled?: boolean }[]
  }
}

export { Example }
