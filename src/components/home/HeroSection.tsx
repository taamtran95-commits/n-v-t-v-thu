import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-food.jpg';

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Món ăn Việt Nam ngon miệng"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-overlay-foreground mb-4 leading-tight"
          >
            Hương Vị
            <br />
            <span className="text-accent">Quê Hương</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-overlay-foreground/80 text-lg mb-8 leading-relaxed"
          >
            Thưởng thức những món ăn Việt Nam truyền thống, được chế biến từ nguyên liệu tươi ngon mỗi ngày.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/thuc-don">
                Xem thực đơn
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
