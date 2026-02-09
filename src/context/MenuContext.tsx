import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type CategorySlug = string;

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
}

interface MenuContextType {
  items: MenuItem[];
  categories: Category[];
  loading: boolean;
  getItemsByCategory: (slug: string) => MenuItem[];
  getItemById: (id: string) => MenuItem | undefined;
  getFeaturedItems: () => MenuItem[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const [dishesRes, catsRes] = await Promise.all([
      supabase.from('dishes').select('*, categories(slug, name)').eq('is_available', true).order('created_at'),
      supabase.from('categories').select('*').order('name'),
    ]);

    if (catsRes.data) {
      setCategories(catsRes.data);
    }

    if (dishesRes.data) {
      const mapped: MenuItem[] = dishesRes.data.map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description || '',
        price: d.price,
        image: d.image_url || '/placeholder.svg',
        category: d.categories?.slug || 'khac',
        featured: false,
      }));
      setItems(mapped);
    }

    setLoading(false);
  };

  const getItemsByCategory = (slug: string) =>
    slug === 'all' ? items : items.filter(item => item.category === slug);

  const getItemById = (id: string) => items.find(item => item.id === id);

  const getFeaturedItems = () => items.slice(0, 4);

  return (
    <MenuContext.Provider value={{ items, categories, loading, getItemsByCategory, getItemById, getFeaturedItems }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
}
