import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { MenuItem } from '@/context/MenuContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FoodCardProps {
  item: MenuItem;
  onDeleted?: () => void;
}

const categoryLabels: Record<string, string> = {
  'mon-chinh': 'Món chính',
  'do-uong': 'Đồ uống',
  'combo': 'Combo',
  'an-vat': 'Ăn vặt',
  'do-nuong': 'Đồ nướng',
};

const FoodCard = ({ item, onDeleted }: FoodCardProps) => {
  const { addItem } = useCart();
  const { isAdmin } = useAuth();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { error } = await supabase.from('dishes').delete().eq('id', item.id);
    if (error) {
      toast.error('Lỗi khi xoá món');
      return;
    }
    toast.success(`Đã xoá "${item.name}"`);
    onDeleted?.();
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
      <Link to={`/mon/${item.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {categoryLabels[item.category] && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              {categoryLabels[item.category]}
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/mon/${item.id}`}>
          <h3 className="font-body font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(item.price)}
          </span>
          <div className="flex items-center gap-1.5">
            {isAdmin && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                onClick={handleDelete}
                title="Xoá món"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="default"
              onClick={(e) => {
                e.preventDefault();
                addItem(item);
                toast.success(`Đã thêm "${item.name}" vào danh sách gọi món`);
              }}
            >
              <Plus className="h-4 w-4" />
              Chọn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
