import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useMenu, MenuItem } from '@/context/MenuContext';
import { useAuth } from '@/hooks/useAuth';
import CategoryFilter from '@/components/menu/CategoryFilter';
import FoodCard from '@/components/menu/FoodCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { getItemsByCategory, categories, loading } = useMenu();
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Use context items but allow refresh
  const displayItems = getItemsByCategory(selectedCategory);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '', category_id: '' });

  const handleRefresh = useCallback(() => {
    // Force MenuContext to re-fetch by reloading page
    window.location.reload();
  }, []);

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!name || name.length > 100) {
      toast.error('Tên món phải từ 1-100 ký tự');
      return;
    }
    if (isNaN(price) || price <= 0) {
      toast.error('Giá không hợp lệ');
      return;
    }

    const { error } = await supabase.from('dishes').insert({
      name,
      description: description || null,
      price,
      image_url: form.image_url.trim() || null,
      category_id: form.category_id || null,
      is_available: true,
    });

    if (error) {
      toast.error('Lỗi khi thêm món: ' + error.message);
      return;
    }

    toast.success(`Đã thêm "${name}" vào thực đơn!`);
    setForm({ name: '', description: '', price: '', image_url: '', category_id: '' });
    setAddOpen(false);
    handleRefresh();
  };

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
          {isAdmin && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" size="lg">
                  <Plus className="h-5 w-5" />
                  Thêm món mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-heading">Thêm món mới</DialogTitle>
                  <DialogDescription>Nhập thông tin món ăn muốn thêm vào thực đơn</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDish} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên món *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="VD: Chân Gà Sả Tắc"
                      maxLength={100}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Mô tả ngắn gọn về món ăn..."
                      maxLength={500}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Giá (VNĐ) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="50000"
                        min={1}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Danh mục</Label>
                      <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Chọn" /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Link hình ảnh</Label>
                    <Input
                      value={form.image_url}
                      onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setAddOpen(false)}>
                      Huỷ
                    </Button>
                    <Button type="submit" variant="hero" className="flex-1">
                      Thêm món
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Đang tải thực đơn...</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <FoodCard item={item} onDeleted={handleRefresh} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && displayItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Không tìm thấy món ăn nào.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MenuPage;
