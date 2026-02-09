import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, User, FileText, Hash } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface OrderData {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  customer: { name: string; phone: string; tableNumber: string; notes: string };
  total: number;
  status: string;
  createdAt: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', tableNumber: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Chưa có món nào</h1>
          <p className="text-muted-foreground mb-6">Hãy chọn món ăn trước khi gọi món.</p>
          <Button variant="outline-primary" asChild>
            <Link to="/thuc-don">Xem thực đơn</Link>
          </Button>
        </div>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone) {
      toast.error('Vui lòng điền đầy đủ họ tên và số điện thoại.');
      return;
    }

    setIsSubmitting(true);

    const orderId = 'AV' + Date.now().toString(36).toUpperCase();

    const order: OrderData = {
      id: orderId,
      items: items.map(ci => ({
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price,
      })),
      customer: form,
      total: totalPrice,
      status: 'received',
      createdAt: new Date().toISOString(),
    };

    const orders: OrderData[] = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    clearCart();

    toast.success(`Gọi món thành công! 🎉 Mã đơn: ${orderId}`);

    navigate('/lich-su');
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Gọi Món</h1>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
              <h2 className="font-heading text-xl font-semibold text-foreground">Thông tin khách hàng</h2>

              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Họ tên
                </Label>
                <Input
                  id="name"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0123 456 789"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tableNumber" className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  Số bàn (tuỳ chọn)
                </Label>
                <Input
                  id="tableNumber"
                  placeholder="VD: Bàn 3"
                  value={form.tableNumber}
                  onChange={e => setForm(f => ({ ...f, tableNumber: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Ghi chú (tuỳ chọn)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Ít cay, thêm rau, không hành..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-1">💰 Thanh toán tại quán</p>
                <p className="text-sm text-muted-foreground">Bạn sẽ thanh toán trực tiếp khi nhận món.</p>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : `Xác nhận gọi món — ${formatPrice(totalPrice)}`}
              </Button>
            </form>

            <div className="md:col-span-2">
              <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
                <h2 className="font-heading text-lg font-semibold text-card-foreground mb-4">Món đã chọn</h2>

                <div className="space-y-3">
                  {items.map(({ item, quantity }) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.name} × {quantity}
                      </span>
                      <span className="text-muted-foreground font-medium">
                        {formatPrice(item.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Tổng cộng</span>
                  <span className="font-bold text-lg text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default CheckoutPage;
