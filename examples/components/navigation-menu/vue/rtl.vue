<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/vue/navigation-menu"
import { ChevronDownIcon } from "@lucide/vue"

const sections = [
  {
    value: "guides",
    label: "الأدلة",
    links: [
      {
        title: "مقدمة",
        href: "https://example.com/docs",
        description: "مكونات بلا أنماط بنواة واحدة لكل إطار عمل.",
      },
      {
        title: "التثبيت",
        href: "https://example.com/docs/installation",
        description: "أضف الحزمة لإطار عملك واعرض أول جزء.",
      },
      {
        title: "التنسيق",
        href: "https://example.com/docs/styling",
        description: "نسّق الأجزاء بسمات البيانات ومتغيرات CSS.",
      },
    ],
  },
  {
    value: "components",
    label: "المكونات",
    links: [
      {
        title: "مربع تنبيه",
        href: "https://example.com/docs/components/alert-dialog",
        description: "يطلب قرارًا قبل استخدام أي شيء آخر في الصفحة.",
      },
      {
        title: "بطاقة التمرير",
        href: "https://example.com/docs/components/hover-card",
        description: "معاينة لما يشير إليه الرابط.",
      },
      {
        title: "علامات التبويب",
        href: "https://example.com/docs/components/tabs",
        description: "تعرض لوحة واحدة من المحتوى في كل مرة.",
      },
    ],
  },
]
</script>

<template>
  <div dir="rtl">
    <NavigationMenu aria-label="الرئيسية">
      <NavigationMenuList>
        <NavigationMenuItem v-for="section in sections" :key="section.value" :value="section.value">
          <NavigationMenuTrigger>
            {{ section.label }}
            <ChevronDownIcon />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              <li v-for="link in section.links" :key="link.href">
                <NavigationMenuLink :href="link.href">
                  <span>{{ link.title }}</span>
                  <span data-slot="hint">{{ link.description }}</span>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="https://example.com/docs">المستندات</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  </div>
</template>
