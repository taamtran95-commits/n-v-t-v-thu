
import { MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/90">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <h3 className="font-heading text-lg font-semibold mb-4">Thông tin</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-background/60">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>63 Phạm Thận Duật, P. Ninh Sơn, TP. Ninh Bình</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <Phone className="h-4 w-4 shrink-0" />
                <span>0965 971 282</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <Clock className="h-4 w-4 shrink-0" />
                <span>16:30 - 22:00 hàng ngày</span>
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
