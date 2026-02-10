import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { MenuProvider } from "@/context/MenuContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import Index from "./pages/Index";
import MenuPage from "./pages/Menu";
import FoodDetailPage from "./pages/FoodDetail";
import CheckoutPage from "./pages/Checkout";
import OrderHistoryPage from "./pages/OrderHistory";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      {!isAdmin && <CartDrawer />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/thuc-don" element={<MenuPage />} />
        <Route path="/mon/:id" element={<FoodDetailPage />} />
        <Route path="/dat-hang" element={<CheckoutPage />} />
        <Route path="/lich-su" element={<OrderHistoryPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MenuProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </MenuProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
