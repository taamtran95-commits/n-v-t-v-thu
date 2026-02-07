import phoBoImage from "@/assets/pho-bo.jpg";
import bunBoImage from "@/assets/bun-bo.jpg";
import comTamImage from "@/assets/com-tam.jpg";
import banhMiImage from "@/assets/banh-mi.jpg";
import bunChaImage from "@/assets/bun-cha.jpg";
import caPheImage from "@/assets/ca-phe.jpg";
import traDaoImage from "@/assets/tra-dao.jpg";
import sinhToImage from "@/assets/sinh-to.jpg";

export type CategorySlug = 'all' | 'mon-chinh' | 'do-uong' | 'combo';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  icon: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Exclude<CategorySlug, 'all'>;
  featured?: boolean;
}

export const categories: Category[] = [
  { id: '0', name: 'Tất cả', slug: 'all', icon: '🍽️' },
  { id: '1', name: 'Món chính', slug: 'mon-chinh', icon: '🍜' },
  { id: '2', name: 'Đồ uống', slug: 'do-uong', icon: '🥤' },
  { id: '3', name: 'Combo', slug: 'combo', icon: '🎁' },
];

export const menuItems: MenuItem[] = [
  {
    id: 'pho-bo',
    name: 'Phở Bò Đặc Biệt',
    description: 'Phở bò truyền thống với nước dùng hầm xương 12 tiếng, thịt bò tái lăn, gân, nạm. Ăn kèm rau thơm và chanh.',
    price: 55000,
    image: phoBoImage,
    category: 'mon-chinh',
    featured: true,
  },
  {
    id: 'bun-bo-hue',
    name: 'Bún Bò Huế',
    description: 'Bún bò Huế cay nồng đặc trưng với giò heo, chả cua, huyết. Nước dùng đậm đà hương sả.',
    price: 50000,
    image: bunBoImage,
    category: 'mon-chinh',
    featured: true,
  },
  {
    id: 'com-tam',
    name: 'Cơm Tấm Sườn Bì Chả',
    description: 'Cơm tấm với sườn nướng mỡ hành, bì, chả trứng. Kèm đồ chua và nước mắm pha.',
    price: 45000,
    image: comTamImage,
    category: 'mon-chinh',
    featured: true,
  },
  {
    id: 'banh-mi',
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì giòn rụm kẹp thịt nướng than hoa, rau sống, đồ chua và nước sốt đặc biệt.',
    price: 30000,
    image: banhMiImage,
    category: 'mon-chinh',
  },
  {
    id: 'bun-cha',
    name: 'Bún Chả Hà Nội',
    description: 'Bún chả với chả viên và thịt nướng thơm lừng, nước chấm chua ngọt. Ăn kèm rau sống.',
    price: 50000,
    image: bunChaImage,
    category: 'mon-chinh',
  },
  {
    id: 'ca-phe',
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê phin truyền thống pha sữa đặc, thêm đá. Đậm đà, thơm ngon.',
    price: 25000,
    image: caPheImage,
    category: 'do-uong',
  },
  {
    id: 'tra-dao',
    name: 'Trà Đào Cam Sả',
    description: 'Trà đào thơm mát kết hợp cam tươi và sả, thanh nhiệt giải khát.',
    price: 30000,
    image: traDaoImage,
    category: 'do-uong',
  },
  {
    id: 'sinh-to',
    name: 'Sinh Tố Bơ',
    description: 'Sinh tố bơ béo ngậy, thêm sữa đặc và đá xay mịn. Bổ dưỡng, thơm ngon.',
    price: 35000,
    image: sinhToImage,
    category: 'do-uong',
  },
  {
    id: 'combo-1',
    name: 'Combo Phở Đặc Biệt',
    description: 'Phở Bò Đặc Biệt + Cà Phê Sữa Đá. Tiết kiệm 15.000đ so với mua lẻ!',
    price: 65000,
    image: phoBoImage,
    category: 'combo',
    featured: true,
  },
  {
    id: 'combo-2',
    name: 'Combo Cơm Tấm',
    description: 'Cơm Tấm Sườn Bì Chả + Trà Đào Cam Sả. Tiết kiệm 10.000đ so với mua lẻ!',
    price: 55000,
    image: comTamImage,
    category: 'combo',
  },
];

export const getFeaturedItems = () => menuItems.filter(item => item.featured);
export const getItemsByCategory = (slug: CategorySlug) =>
  slug === 'all' ? menuItems : menuItems.filter(item => item.category === slug);
export const getItemById = (id: string) => menuItems.find(item => item.id === id);
