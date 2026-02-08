import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Package, ChefHat, CheckCircle2, Clock, UtensilsCrossed } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OrderData {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  customer: { name: string; phone: string; tableNumber: string; notes: string };
  total: number;
  status: string;
  createdAt: string;
}

const statuses = [
  { key: 'received', label: 'Đã tiếp nhận', icon: Package, description: 'Quán đã nhận đơn gọi món' },
  { key: 'preparing', label: 'Đang chế biến', icon: ChefHat, description: 'Bếp đang chế biến món ăn' },
  { key: 'ready', label: 'Sẵn sàng phục vụ', icon: UtensilsCrossed, description: 'Món ăn đã sẵn sàng' },
  { key: 'completed', label: 'Hoàn thành', icon: CheckCircle2, description: 'Đã phục vụ xong' },
];

function getSimulatedStatus(createdAt: string): string {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const minutes = elapsed / (1000 * 60);
  if (minutes < 2) return 'received';
  if (minutes < 5) return 'preparing';
  if (minutes < 10) return 'ready';
  return 'completed';
}

const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const findOrder = (id: string) => {
    const orders: OrderData[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const found = orders.find(o => o.id === id);
    if (found) {
      found.status = getSimulatedStatus(found.createdAt);
      setOrder(found);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  useEffect(() => {
    const orderId = searchParams.get('order');
    if (orderId) {
      setSearchId(orderId);
      findOrder(orderId);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      findOrder(searchId.trim());
    }
  };

  const currentStatusIndex = order ? statuses.findIndex(s => s.key === order.status) : -1;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2 text-center">
            Theo Dõi Đơn Món
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Nhập mã đơn để xem trạng thái chế biến
          </p>

          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <Input
              placeholder="Nhập mã đơn (VD: AVXXXXXX)"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="default">
              <Search className="h-4 w-4" />
              Tìm
            </Button>
          </form>

          {notFound && (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground mb-4">Không tìm thấy đơn với mã "{searchId}"</p>
              <Button variant="outline-primary" asChild>
                <Link to="/thuc-don">Gọi món ngay</Link>
              </Button>
            </div>
          )}

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Mã đơn</p>
                    <p className="font-bold text-foreground text-lg">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Thời gian gọi món</p>
                    <p className="font-medium text-foreground text-sm">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="space-y-0">
                  {statuses.map((status, index) => {
                    const isActive = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const StatusIcon = status.icon;

                    return (
                      <div key={status.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-muted-foreground'
                            } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                          >
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          {index < statuses.length - 1 && (
                            <div
                              className={`w-0.5 h-8 transition-colors ${
                                index < currentStatusIndex ? 'bg-primary' : 'bg-border'
                              }`}
                            />
                          )}
                        </div>
                        <div className="pb-6">
                          <p className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {status.label}
                          </p>
                          <p className="text-sm text-muted-foreground">{status.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-heading text-lg font-semibold text-card-foreground mb-4">Chi tiết đơn món</h2>

                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-foreground">{item.name} × {item.quantity}</span>
                      <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Tổng cộng</span>
                  <span className="font-bold text-primary text-lg">{formatPrice(order.total)}</span>
                </div>

                {order.customer.tableNumber && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Bàn: {order.customer.tableNumber}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default OrderTrackingPage;
