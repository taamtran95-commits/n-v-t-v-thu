import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/90">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍡</span>
              <span className="font-heading text-xl font-bold">Ăn Vặt Vũ Thuý</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Mang đến những món ăn vặt Việt Nam ngon miệng, đậm đà hương vị quê hương.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Liên kết</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-background/60 hover:text-background transition-colors">Trang chủ</Link>
              <Link to="/thuc-don" className="text-sm text-background/60 hover:text-background transition-colors">Thực đơn</Link>
              <Link to="/theo-doi" className="text-sm text-background/60 hover:text-background transition-colors">Theo dõi đơn hàng</Link>
            </nav>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Liên hệ</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-background/60">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>123 Đường Nguyễn Huệ, Q.1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <Phone className="h-4 w-4 shrink-0" />
                <span>0123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <Clock className="h-4 w-4 shrink-0" />
                <span>7:00 - 22:00 hàng ngày</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 text-center text-sm text-background/40">
          © 2026 Ăn Vặt Vũ Thuý. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
