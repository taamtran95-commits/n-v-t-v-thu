import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import Index from "./pages/Index";
import MenuPage from "./pages/Menu";
import FoodDetailPage from "./pages/FoodDetail";
import CheckoutPage from "./pages/Checkout";
import OrderTrackingPage from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Header />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/thuc-don" element={<MenuPage />} />
            <Route path="/mon/:id" element={<FoodDetailPage />} />
            <Route path="/dat-hang" element={<CheckoutPage />} />
            <Route path="/theo-doi" element={<OrderTrackingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
