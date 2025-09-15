import FreshFoodImg from '@/assets/images/categories/fresh-food.png';
import MeatSeafoodImg from '@/assets/images/categories/meat-seafood.png';
import DairyBeverageImg from '@/assets/images/categories/dairy-beverage.png';
import ReadyMealImg from '@/assets/images/categories/ready-meal.png';
import SnackImg from '@/assets/images/categories/snack.png';
import HealthFood from '@/assets/images/categories/health-food.png';
import DailyGoodsImg from '@/assets/images/categories/daily-goods.png';
import HygieneImg from '@/assets/images/categories/hygiene.png';
import PetsImg from '@/assets/images/categories/pets.png';
import BabyImg from '@/assets/images/categories/baby.png';

export const categories = [
  {
    id: 1,
    text: '신선식품',
    slug: 'fresh-food',
    rootCategory: 'FRESH_FOOD',
    image: FreshFoodImg,
  },
  {
    id: 2,
    text: '정육·수산물',
    slug: 'meat-seafood',
    rootCategory: 'MEAT_SEAFOOD',
    image: MeatSeafoodImg,
  },
  {
    id: 3,
    text: '유제품·음료',
    slug: 'dairy-beverage',
    rootCategory: 'DAIRY_BEVERAGE',
    image: DairyBeverageImg,
  },
  {
    id: 4,
    text: '간편식',
    slug: 'ready-meal',
    rootCategory: 'READY_MEAL',
    image: ReadyMealImg,
  },
  {
    id: 5,
    text: '간식',
    slug: 'snack',
    rootCategory: 'SNACK',
    image: SnackImg,
  },
  {
    id: 6,
    text: '건강식품',
    slug: 'health-food',
    rootCategory: 'HEALTH_FOOD',
    image: HealthFood,
  },
  {
    id: 7,
    text: '생활잡화',
    slug: 'daily-goods',
    rootCategory: 'DAILY_GOODS',
    image: DailyGoodsImg,
  },
  {
    id: 8,
    text: '위생용품',
    slug: 'hygiene',
    rootCategory: 'HYGIENE',
    image: HygieneImg,
  },
  {
    id: 9,
    text: '반려동물',
    slug: 'pets',
    rootCategory: 'PETS',
    image: PetsImg,
  },
  {
    id: 10,
    text: '육아용품',
    slug: 'baby',
    rootCategory: 'BABY',
    image: BabyImg,
  },
];

export const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.text]));
