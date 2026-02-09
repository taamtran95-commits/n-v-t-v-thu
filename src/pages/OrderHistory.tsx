import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Package, ChefHat, CheckCircle2, UtensilsCrossed, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';

interface OrderData {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  customer: { name: string; phone: string; tableNumber: string; notes: string };
  total: number;
  status: string;
  createdAt: string;
}

const statusMap: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  received: { label: 'Đã tiếp nhận', icon: Package, color: 'text-blue-500' },
  preparing: { label: 'Đang chế biến', icon: ChefHat, color: 'text-amber-500' },
  ready: { label: 'Sẵn sàng phục vụ', icon: UtensilsCrossed, color: 'text-emerald-500' },
  completed: { label: 'Hoàn thành', icon: CheckCircle2, color: 'text-primary' },
};

function getSimulatedStatus(createdAt: string): string {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const minutes = elapsed / (1000 * 60);
  if (minutes < 2) return 'received';
  if (minutes < 5) return 'preparing';
  if (minutes < 10) return 'ready';
  return 'completed';
}

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    const stored: OrderData[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const updated = stored.map(o => ({ ...o, status: getSimulatedStatus(o.createdAt) }));
    setOrders(updated.reverse());
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('orders');
    setOrders([]);
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
            Lịch Sử Đơn Món
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Xem lại các đơn món bạn đã gọi
          </p>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground mb-4">Chưa có đơn món nào</p>
              <Button variant="outline-primary" asChild>
                <Link to="/thuc-don">Gọi món ngay</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xoá lịch sử
                </Button>
              </div>

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
                          <p className="font-bold text-foreground">{order.id}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          {statusInfo.label}
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-foreground">{item.name} × {item.quantity}</span>
                            <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-border pt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                          {order.customer.tableNumber && ` · Bàn ${order.customer.tableNumber}`}
                        </div>
                        <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default OrderHistoryPage;
