import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, CategorySlug, menuItems as defaultMenuItems } from '@/data/menu';

interface MenuContextType {
  items: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  removeMenuItem: (itemId: string) => void;
  getItemsByCategory: (slug: CategorySlug) => MenuItem[];
  getItemById: (id: string) => MenuItem | undefined;
  getFeaturedItems: () => MenuItem[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('menu-items');
      return saved ? JSON.parse(saved) : defaultMenuItems;
    } catch {
      return defaultMenuItems;
    }
  });

  useEffect(() => {
    localStorage.setItem('menu-items', JSON.stringify(items));
  }, [items]);

  const addMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const id = `custom-${Date.now()}`;
    setItems(prev => [...prev, { ...newItem, id }]);
  };

  const removeMenuItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getItemsByCategory = (slug: CategorySlug) =>
    slug === 'all' ? items : items.filter(item => item.category === slug);

  const getItemById = (id: string) => items.find(item => item.id === id);

  const getFeaturedItems = () => items.filter(item => item.featured);

  return (
    <MenuContext.Provider value={{ items, addMenuItem, removeMenuItem, getItemsByCategory, getItemById, getFeaturedItems }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
}
