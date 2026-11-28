import { Component, computed, signal } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/angular/accordion"

@Component({
  imports: [
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
    LucideChevronDown,
  ],
  template: `
    <div>
      <div data-slot="controls">
        <input
          type="search"
          aria-label="Search questions"
          placeholder="Search questions…"
          [value]="query()"
          #field
          (input)="search(field.value)"
        />
      </div>
      <div uiAccordion [(value)]="value" multiple>
        @for (question of results(); track question.value) {
          <div uiAccordionItem [value]="question.value">
            <h3 uiAccordionHeader>
              <button uiAccordionTrigger>
                <span>
                  @for (
                    part of highlight(question.question, query());
                    track index;
                    let index = $index
                  ) {
                    @if (part.match) {
                      <mark>{{ part.text }}</mark>
                    } @else {
                      <span>{{ part.text }}</span>
                    }
                  }
                </span>
                <svg lucideChevronDown></svg>
              </button>
            </h3>
            <div uiAccordionPanel>
              @for (
                part of highlight(question.answer, query());
                track index;
                let index = $index
              ) {
                @if (part.match) {
                  <mark>{{ part.text }}</mark>
                } @else {
                  <span>{{ part.text }}</span>
                }
              }
            </div>
          </div>
        }
      </div>
      <p data-slot="hint" role="status">
        @if (results().length === 0) {
          No questions match “{{ query() }}”.
        }
      </p>
    </div>
  `,
})
class Example {
  readonly faq = [
    {
      value: "returns",
      question: "What is your return policy?",
      answer:
        "Return any unused item within 30 days. Once it reaches us, your refund is on its way.",
    },
    {
      value: "refunds",
      question: "How long do refunds take?",
      answer:
        "Refunds reach your card within 5 to 7 business days after we receive the item.",
    },
    {
      value: "shipping",
      question: "Do you ship internationally?",
      answer:
        "We ship to 40 countries. Duties are included in the price at checkout.",
    },
    {
      value: "tracking",
      question: "How do I track my order?",
      answer:
        "Every shipping email has a tracking link. You'll also find it under Orders.",
    },
    {
      value: "exchange",
      question: "Can I exchange an item for another size?",
      answer:
        "Yes. Start a return, choose Exchange and pick the new size. Shipping is free.",
    },
    {
      value: "gift",
      question: "Can I send an order as a gift?",
      answer:
        "Add a gift note at checkout and we'll leave the prices off the packing slip.",
    },
  ]

  matches(question: (typeof this.faq)[number], query: string) {
    const search = query.trim().toLowerCase()
    return (
      !search ||
      question.question.toLowerCase().includes(search) ||
      question.answer.toLowerCase().includes(search)
    )
  }

  highlight(text: string, query: string) {
    const search = query.trim().toLowerCase()
    if (!search) {
      return [{ text, match: false }]
    }
    const parts: { text: string; match: boolean }[] = []
    let start = 0
    for (let index = text.toLowerCase().indexOf(search); index !== -1;) {
      if (index > start) {
        parts.push({ text: text.slice(start, index), match: false })
      }
      parts.push({
        text: text.slice(index, index + search.length),
        match: true,
      })
      start = index + search.length
      index = text.toLowerCase().indexOf(search, start)
    }
    if (start < text.length) {
      parts.push({ text: text.slice(start), match: false })
    }
    return parts
  }

  readonly query = signal("")

  readonly value = signal<string[]>([])

  readonly results = computed(() =>
    this.faq.filter((question) => this.matches(question, this.query()))
  )

  search(next: string) {
    this.query.set(next)
    this.value.set(
      next.trim() ? this.results().map((question) => question.value) : []
    )
  }
}

export { Example }
