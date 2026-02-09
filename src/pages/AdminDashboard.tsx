import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, UtensilsCrossed, ClipboardList, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Dish {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_available: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  table_number: string | null;
  notes: string | null;
  total: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  dish_name: string;
  quantity: number;
  price: number;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  received: { label: 'Đã tiếp nhận', color: 'bg-blue-100 text-blue-800' },
  preparing: { label: 'Đang chế biến', color: 'bg-amber-100 text-amber-800' },
  ready: { label: 'Sẵn sàng', color: 'bg-emerald-100 text-emerald-800' },
  completed: { label: 'Hoàn thành', color: 'bg-muted text-muted-foreground' },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [tab, setTab] = useState<'menu' | 'orders'>('menu');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '', category_id: '', is_available: true });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchDishes();
      fetchCategories();
      fetchOrders();
    }
  }, [isAdmin]);

  // Realtime orders
  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  const fetchDishes = async () => {
    const { data } = await supabase.from('dishes').select('*').order('created_at', { ascending: false });
    if (data) setDishes(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const fetchOrderItems = async (orderId: string) => {
    if (orderItems[orderId]) return;
    const { data } = await supabase.from('order_items').select('*').eq('order_id', orderId);
    if (data) setOrderItems(prev => ({ ...prev, [orderId]: data }));
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('dishes').insert({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      image_url: form.image_url.trim() || null,
      category_id: form.category_id || null,
      is_available: form.is_available,
    });
    if (error) {
      toast.error('Lỗi khi thêm món: ' + error.message);
      return;
    }
    toast.success('Đã thêm món mới!');
    setForm({ name: '', description: '', price: '', image_url: '', category_id: '', is_available: true });
    setAddOpen(false);
    fetchDishes();
  };

  const deleteDish = async (id: string) => {
    const { error } = await supabase.from('dishes').delete().eq('id', id);
    if (error) {
      toast.error('Lỗi khi xoá: ' + error.message);
      return;
    }
    toast.success('Đã xoá món');
    fetchDishes();
  };

  const toggleAvailability = async (dish: Dish) => {
    await supabase.from('dishes').update({ is_available: !dish.is_available }).eq('id', dish.id);
    fetchDishes();
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) {
      toast.error('Lỗi cập nhật: ' + error.message);
      return;
    }
    toast.success('Đã cập nhật trạng thái');
    fetchOrders();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Đang tải...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">Quản lý quán</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="h-4 w-4 mr-1" />
            Đăng xuất
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === 'menu' ? 'default' : 'outline'}
            onClick={() => setTab('menu')}
          >
            <UtensilsCrossed className="h-4 w-4 mr-1" />
            Thực đơn
          </Button>
          <Button
            variant={tab === 'orders' ? 'default' : 'outline'}
            onClick={() => setTab('orders')}
          >
            <ClipboardList className="h-4 w-4 mr-1" />
            Đơn món ({orders.filter(o => o.status !== 'completed').length})
          </Button>
        </div>

        {tab === 'menu' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Thực đơn ({dishes.length} món)
              </h2>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm món
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-heading">Thêm món mới</DialogTitle>
                    <DialogDescription>Nhập thông tin món ăn</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddDish} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tên món *</Label>
                      <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Giá (VNĐ) *</Label>
                        <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min={1} />
                      </div>
                      <div className="space-y-2">
                        <Label>Danh mục</Label>
                        <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                          <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
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
                      <Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
                    </div>
                    <Button type="submit" variant="hero" className="w-full">Thêm món</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {dishes.map(dish => (
                <div key={dish.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  {dish.image_url && (
                    <img src={dish.image_url} alt={dish.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">{dish.name}</h3>
                      {!dish.is_available && <Badge variant="secondary">Hết hàng</Badge>}
                    </div>
                    <p className="text-sm text-primary font-semibold">{formatPrice(dish.price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => toggleAvailability(dish)} title={dish.is_available ? 'Đánh dấu hết' : 'Mở lại'}>
                      {dish.is_available ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteDish(dish.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {dishes.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Chưa có món nào. Thêm món đầu tiên!</p>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {orders.map(order => {
              const statusInfo = statusLabels[order.status] || statusLabels.received;
              return (
                <div key={order.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-foreground">{order.order_code}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_name} · {order.customer_phone}
                        {order.table_number && ` · Bàn ${order.table_number}`}
                      </p>
                    </div>
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                  </div>

                  {!orderItems[order.id] ? (
                    <Button variant="ghost" size="sm" onClick={() => fetchOrderItems(order.id)}>
                      Xem chi tiết
                    </Button>
                  ) : (
                    <div className="space-y-1 mb-3">
                      {orderItems[order.id].map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.dish_name} × {item.quantity}</span>
                          <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {order.notes && (
                    <p className="text-sm text-muted-foreground italic mb-3">📝 {order.notes}</p>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                      {order.status !== 'completed' && (
                        <Select
                          value={order.status}
                          onValueChange={v => updateOrderStatus(order.id, v)}
                        >
                          <SelectTrigger className="w-[150px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="received">Đã tiếp nhận</SelectItem>
                            <SelectItem value="preparing">Đang chế biến</SelectItem>
                            <SelectItem value="ready">Sẵn sàng</SelectItem>
                            <SelectItem value="completed">Hoàn thành</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {orders.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Chưa có đơn nào</p>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
