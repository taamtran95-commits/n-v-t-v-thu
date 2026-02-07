import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useMenu } from '@/context/MenuContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categoryLabels: Record<string, string> = {
  'mon-chinh': 'Món chính',
  'do-uong': 'Đồ uống',
  'combo': 'Combo',
};

const FoodDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { getItemById } = useMenu();
  const [quantity, setQuantity] = useState(1);

  const item = id ? getItemById(id) : undefined;

  if (!item) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Không tìm thấy món ăn</h1>
          <Button variant="outline-primary" asChild>
            <Link to="/thuc-don">Quay lại thực đơn</Link>
          </Button>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem(item, quantity);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <Badge variant="secondary" className="w-fit mb-3">
              {categoryLabels[item.category]}
            </Badge>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {item.name}
            </h1>

            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
              {item.description}
            </p>

            <div className="text-3xl font-bold text-primary mb-8">
              {formatPrice(item.price)}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground">Số lượng:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button variant="hero" size="xl" onClick={handleAddToCart} className="w-full md:w-auto">
              <ShoppingCart className="h-5 w-5" />
              Thêm vào giỏ — {formatPrice(item.price * quantity)}
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default FoodDetailPage;
