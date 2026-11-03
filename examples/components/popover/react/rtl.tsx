import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"

export function Example() {
  return (
    <div dir="rtl">
      <Popover>
        <PopoverTrigger>الأبعاد</PopoverTrigger>
        <PopoverContent align="start" sideOffset={8}>
          <PopoverArrow />
          <PopoverTitle>الأبعاد</PopoverTitle>
          <PopoverDescription>اضبط أبعاد الطبقة.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}
