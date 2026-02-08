import { useState } from 'react';
import { motion } from 'framer-motion';
import { CategorySlug } from '@/data/menu';
import { useMenu } from '@/context/MenuContext';
import CategoryFilter from '@/components/menu/CategoryFilter';
import FoodCard from '@/components/menu/FoodCard';
import AddDishDialog from '@/components/menu/AddDishDialog';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>('all');
  const { getItemsByCategory } = useMenu();
  const items = getItemsByCategory(selectedCategory);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            Thực Đơn
          </h1>
          <p className="text-muted-foreground">
            Khám phá các món ăn ngon tại Ăn Vặt Vũ Thuý
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
          <AddDishDialog />
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <FoodCard item={item} />
            </motion.div>
          ))}
        </motion.div>

        {items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Không tìm thấy món ăn nào.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MenuPage;
