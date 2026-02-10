import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // Auto-assign admin role after signup
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if any admin exists
        const { count } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'admin');
        if (count === 0) {
          await supabase.from('user_roles').insert({ user_id: user.id, role: 'admin' });
        }
      }

      toast.success('Đăng ký thành công! Bạn là admin đầu tiên.');
      navigate('/admin');
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error('Sai email hoặc mật khẩu');
        setLoading(false);
        return;
      }
      toast.success('Đăng nhập thành công!');
      navigate('/admin');
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-8 w-full max-w-sm shadow-lg"
      >
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">🔐</span>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {isSignUp ? 'Tạo tài khoản Admin' : 'Đăng nhập quản lý'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Dành cho chủ quán</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : isSignUp ? 'Đăng ký' : 'Đăng nhập'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-medium hover:underline"
          >
            {isSignUp ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </p>
      </motion.div>
    </main>
  );
};

export default AdminLogin;
