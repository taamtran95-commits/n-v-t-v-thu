import { useState } from 'react';
import { Plus, ImagePlus } from 'lucide-react';
import { useMenu } from '@/context/MenuContext';
import { CategorySlug } from '@/data/menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const categoryOptions: { value: Exclude<CategorySlug, 'all'>; label: string }[] = [
  { value: 'mon-chinh', label: 'Món chính' },
  { value: 'do-uong', label: 'Đồ uống' },
  { value: 'combo', label: 'Combo' },
];

const AddDishDialog = () => {
  const { addMenuItem } = useMenu();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Exclude<CategorySlug, 'all'>>('mon-chinh');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('mon-chinh');
    setImageUrl('');
    setFeatured(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const trimmedImage = imageUrl.trim();
    const parsedPrice = Number(price);

    if (!trimmedName || trimmedName.length > 100) {
      toast.error('Tên món phải từ 1-100 ký tự');
      return;
    }
    if (!trimmedDesc || trimmedDesc.length > 500) {
      toast.error('Mô tả phải từ 1-500 ký tự');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0 || parsedPrice > 10000000) {
      toast.error('Giá phải từ 1đ đến 10.000.000đ');
      return;
    }

    addMenuItem({
      name: trimmedName,
      description: trimmedDesc,
      price: parsedPrice,
      image: trimmedImage || '/placeholder.svg',
      category,
      featured,
    });

    toast.success(`Đã thêm "${trimmedName}" vào thực đơn!`);
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên món *</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="VD: Phở Bò Đặc Biệt"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn về món ăn..."
              maxLength={500}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="50000"
                min={1}
                max={10000000}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Exclude<CategorySlug, 'all'>)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Link hình ảnh</Label>
            <div className="flex gap-2">
              <ImagePlus className="h-5 w-5 text-muted-foreground mt-2 shrink-0" />
              <Input
                id="image"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="featured" className="cursor-pointer">Đánh dấu là món nổi bật</Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              Thêm món
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDishDialog;
