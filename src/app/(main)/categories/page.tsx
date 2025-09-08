import HeaderCustom from '@/components/HeaderCustom';
import { categories as staticCategories } from '@/constants/categories';
import Image from 'next/image';
import Link from 'next/link';

type ApiRootCategory = {
  key: string;
  name: string;
  subCategories?: { key: string; name: string }[];
};

type UiCategory = {
  slug: string;
  text: string;
  image: any;
};

const ROOT_KEY_TO_SLUG: Record<string, string> = {
  FRESH_FOOD: 'fresh-food',
  MEAT_SEAFOOD: 'meat-seafood',
  DAIRY_BEVERAGE: 'dairy-beverage',
  CONVENIENCE_FOOD: 'ready-meal',
  SNACK: 'snack',
  HEALTH_SUPPLEMENTS: 'health-food',
  DAILY_GOODS: 'daily-goods',
  HYGIENE: 'hygiene',
  PET_SUPPLIES: 'pets',
  BABY_SUPPLIES: 'baby',
};

async function fetchRootCategories(): Promise<UiCategory[]> {
  const imageBySlug = Object.fromEntries(staticCategories.map((c) => [c.slug, c.image])) as Record<
    string,
    any
  >;

  try {
    const res = await fetch(
      'http://ec2-3-37-125-93.ap-northeast-2.compute.amazonaws.com:8080/api/v1/categories/root',
      { cache: 'force-cache', next: { revalidate: 86400 } },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: {
      status: number;
      message: string;
      data: ApiRootCategory[];
    } = await res.json();

    const ui: UiCategory[] = [];
    for (const item of json.data ?? []) {
      const slug = ROOT_KEY_TO_SLUG[item.key];
      if (!slug) continue;
      const image = imageBySlug[slug];
      ui.push({ slug, text: item.name, image });
    }

    if (ui.length === 0) {
      return staticCategories.map((c) => ({ slug: c.slug, text: c.text, image: c.image }));
    }
    return ui;
  } catch (e) {
    return staticCategories.map((c) => ({ slug: c.slug, text: c.text, image: c.image }));
  }
}

export default async function CategoriesPage() {
  const categories = await fetchRootCategories();

  return (
    <div className="flex flex-col items-center justify-center pb-4">
      <HeaderCustom title="카테고리" showSearch showCart />
      <div className="grid w-full grid-cols-2 gap-2 px-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="font-base flex flex-col items-center gap-4 rounded bg-gray-100 p-8 pb-4 text-base text-black"
          >
            {cat.image ? (
              <Image src={cat.image} alt={cat.text} width={111} height={111} />
            ) : (
              <div className="h-[111px] w-[111px] rounded bg-gray-200" />
            )}
            <span>{cat.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
