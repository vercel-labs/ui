<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
</script>

<div data-slot="stack" dir="rtl">
  <label data-slot="label">
    <Checkbox>
      <CheckboxIndicator>
        <Check />
      </CheckboxIndicator>
    </Checkbox>
    قبول الشروط والأحكام
  </label>
  <label data-slot="label">
    <Checkbox defaultChecked>
      <CheckboxIndicator>
        <Check />
      </CheckboxIndicator>
    </Checkbox>
    تفعيل الإشعارات
  </label>
</div>
