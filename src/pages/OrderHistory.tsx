import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Package, ChefHat, CheckCircle2, UtensilsCrossed, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OrderData {
  id: string;
  order_code: string;
  customer_name: string;
  total: number;
  status: string;
  table_number: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  dish_name: string;
  quantity: number;
  price: number;
}

const statusMap: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  received: { label: 'Đã tiếp nhận', icon: Package, color: 'text-blue-500' },
  preparing: { label: 'Đang chế biến', icon: ChefHat, color: 'text-amber-500' },
  ready: { label: 'Sẵn sàng phục vụ', icon: UtensilsCrossed, color: 'text-emerald-500' },
  completed: { label: 'Hoàn thành', icon: CheckCircle2, color: 'text-primary' },
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<(OrderData & { items?: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    const savedCodes: string[] = JSON.parse(localStorage.getItem('my_order_codes') || '[]');

    if (savedCodes.length === 0) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('order_code', savedCodes)
      .order('created_at', { ascending: false });

    if (data) {
      // Fetch items for all orders
      const orderIds = data.map(o => o.id);
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      const ordersWithItems = data.map(o => ({
        ...o,
        items: items?.filter(i => i.order_id === o.id) || [],
      }));

      setOrders(ordersWithItems);
    }

    setLoading(false);
  };

  const searchOrder = async () => {
    if (!searchCode.trim()) return;

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('order_code', searchCode.trim().toUpperCase())
      .maybeSingle();

    if (data) {
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', data.id);

      const exists = orders.find(o => o.id === data.id);
      if (!exists) {
        setOrders(prev => [{ ...data, items: items || [] }, ...prev]);

        // Save code for future visits
        const savedCodes: string[] = JSON.parse(localStorage.getItem('my_order_codes') || '[]');
        if (!savedCodes.includes(data.order_code)) {
          savedCodes.push(data.order_code);
          localStorage.setItem('my_order_codes', JSON.stringify(savedCodes));
        }
      }
    } else {
      // Show not found inline
      setOrders(prev => prev);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2 text-center">
            Đơn Món Của Tôi
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Xem lại các đơn món bạn đã gọi
          </p>

          <form
            onSubmit={e => { e.preventDefault(); searchOrder(); }}
            className="flex gap-3 mb-8"
          >
            <Input
              placeholder="Tìm đơn theo mã (VD: AVXXXXXX)"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="default">
              <Search className="h-4 w-4" />
              Tìm
            </Button>
          </form>

          {loading ? (
            <p className="text-center text-muted-foreground py-8">Đang tải...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground mb-4">Chưa có đơn món nào</p>
              <Button variant="outline-primary" asChild>
                <Link to="/thuc-don">Gọi món ngay</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => {
                const statusInfo = statusMap[order.status] || statusMap.received;
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Mã đơn</p>
                        <p className="font-bold text-foreground">{order.order_code}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {statusInfo.label}
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-foreground">{item.dish_name} × {item.quantity}</span>
                            <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-border pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(order.created_at).toLocaleString('vi-VN')}
                        {order.table_number && ` · Bàn ${order.table_number}`}
                      </div>
                      <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default OrderHistoryPage;
