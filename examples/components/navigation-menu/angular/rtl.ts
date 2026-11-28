import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@ui-sdk/angular/navigation-menu"

@Component({
  imports: [
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    LucideChevronDown,
  ],
  template: `
    <div dir="rtl">
      <nav uiNavigationMenu aria-label="الرئيسية">
        <ul uiNavigationMenuList>
          @for (section of sections; track section.value) {
            <li uiNavigationMenuItem [value]="section.value">
              <button uiNavigationMenuTrigger>
                {{ section.label }}
                <svg lucideChevronDown></svg>
              </button>
              <div *uiNavigationMenuContent>
                <ul>
                  @for (link of section.links; track link.title) {
                    <li>
                      <a uiNavigationMenuLink [href]="link.href">
                        <span>{{ link.title }}</span>
                        <span data-slot="hint">{{ link.description }}</span>
                      </a>
                    </li>
                  }
                </ul>
              </div>
            </li>
          }
          <li uiNavigationMenuItem>
            <a uiNavigationMenuLink href="#">المستندات</a>
          </li>
        </ul>
        <div *uiNavigationMenuViewport="{ sideOffset: 8 }"></div>
      </nav>
    </div>
  `,
})
class Example {
  readonly sections = [
    {
      value: "guides",
      label: "الأدلة",
      links: [
        {
          title: "مقدمة",
          href: "#",
          description: "مكونات بلا أنماط بنواة واحدة لكل إطار عمل.",
        },
        {
          title: "التثبيت",
          href: "#",
          description: "أضف الحزمة لإطار عملك واعرض أول جزء.",
        },
        {
          title: "التنسيق",
          href: "#",
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
          href: "#",
          description: "يطلب قرارًا قبل استخدام أي شيء آخر في الصفحة.",
        },
        {
          title: "بطاقة التمرير",
          href: "#",
          description: "معاينة لما يشير إليه الرابط.",
        },
        {
          title: "علامات التبويب",
          href: "#",
          description: "تعرض لوحة واحدة من المحتوى في كل مرة.",
        },
      ],
    },
  ]
}

export { Example }
