'use client';

import type { Category } from '@/types/category';
import Link from 'next/link';
import babyImg from '@/assets/images/categories/baby.png';
import dailyGoodsImg from '@/assets/images/categories/daily-goods.png';
import dairyBeverageImg from '@/assets/images/categories/dairy-beverage.png';
import freshfoodImg from '@/assets/images/categories/fresh-food.png';
import healthFoodImg from '@/assets/images/categories/health-food.png';
import hygieneImg from '@/assets/images/categories/hygiene.png';
import meatSeafoodImg from '@/assets/images/categories/meat-seafood.png';
import petsImg from '@/assets/images/categories/pets.png';
import readyMealImg from '@/assets/images/categories/ready-meal.png';
import snackImg from '@/assets/images/categories/snack.png';

// 이미지 매핑 객체
const categoryImages: Record<string, string> = {
  baby: babyImg.src,
  'daily-goods': dailyGoodsImg.src,
  'dairy-beverage': dairyBeverageImg.src,
  'fresh-food': freshfoodImg.src,
  'health-food': healthFoodImg.src,
  hygiene: hygieneImg.src,
  'meat-seafood': meatSeafoodImg.src,
  pets: petsImg.src,
  'ready-meal': readyMealImg.src,
  snack: snackImg.src,
};

interface CategoryProps {
  c: Category;
}

function Category({ c }: CategoryProps) {
  const src = categoryImages[c.slug] || `/assets/images/categories/${c.slug}.png`;

  return (
    <Link href={`/categories/${c.slug}`} className="text-center">
      <div className="flex aspect-[1/1] w-full items-center justify-center rounded-sm bg-gray-200">
        <img src={src} alt={c.text} className="h-3/4 w-3/4 object-contain" />
      </div>
      <span className="text-xs">{c.text}</span>
    </Link>
  );
}

interface CategoryListProps {
  categories: Category[];
}

function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {categories.map((c) => (
        <Category key={c.id} c={c} />
      ))}
    </div>
  );
}

export { Category, CategoryList };
