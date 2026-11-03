import { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger } from "@ui-sdk/solid/hover-card"

function Example() {
  return (
    <div dir="rtl">
      <HoverCard>
        <HoverCardTrigger href="https://example.com/people/ada">آدا لوفليس</HoverCardTrigger>
        <HoverCardContent align="start" sideOffset={10}>
          <HoverCardArrow />
          <p>آدا لوفليس</p>
          <p>كتبت أول برنامج منشور للمحرك التحليلي.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

export { Example }
