<script lang="ts">
  import { SearchIcon, XIcon } from "@lucide/svelte"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input, InputClear, InputGroup } from "@ui-sdk/svelte/input"
</script>

<div data-slot="stack" dir="rtl">
  <Field name="name">
    <FieldLabel>
      الاسم الكامل
    </FieldLabel>
    <Input placeholder="ليلى حسن" />
    <FieldDescription>كما يظهر في ملفك الشخصي.</FieldDescription>
  </Field>
  <InputGroup>
    <SearchIcon />
    <Input type="search" aria-label="بحث" defaultValue="حسن" />
    <InputClear aria-label="مسح البحث">
      <XIcon />
    </InputClear>
  </InputGroup>
</div>
