
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Category, Order, StoreSettings, PRODUCTS_DATA, CATEGORIES_DATA, ORDERS_DATA, STORE_SETTINGS_DATA, CartItem } from '../../data/mock-data';

interface DataContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addProducts: (newProducts: Product[]) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
    }
    return defaultValue;
};

const setInLocalStorage = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => getFromLocalStorage('products', PRODUCTS_DATA));
  const [categories, setCategories] = useState<Category[]>(() => getFromLocalStorage('categories', CATEGORIES_DATA));
  const [orders, setOrders] = useState<Order[]>(() => getFromLocalStorage('orders', ORDERS_DATA));
  const [settings, setSettings] = useState<StoreSettings>(() => getFromLocalStorage('settings', STORE_SETTINGS_DATA));

  useEffect(() => { setInLocalStorage('products', products); }, [products]);
  useEffect(() => { setInLocalStorage('categories', categories); }, [categories]);
  useEffect(() => { setInLocalStorage('orders', orders); }, [orders]);
  useEffect(() => { setInLocalStorage('settings', settings); }, [settings]);


  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: `prod${Date.now()}` };
    setProducts(prev => [...prev, newProduct]);
  };

  const addProducts = (newProducts: Product[]) => {
    setProducts(prev => [...newProducts, ...prev]);
  };
  
  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: `cat${Date.now()}` };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };
  
  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const addOrder = (order: Order) => {
    // Add order to list
    setOrders(prev => [order, ...prev]);
    
    // Decrement stock for each item in the order
    setProducts(prevProducts => {
        const productsMap = new Map(prevProducts.map(p => [p.id, { ...p, colors: p.colors ? [...p.colors.map(c => ({...c}))] : undefined }]));

        order.items.forEach((item: CartItem) => {
            const product = productsMap.get(item.product.id);
            if (product) {
                // Decrement stock from the specific color variation if it exists
                if (item.color && product.colors) {
                    const colorIndex = product.colors.findIndex(c => c.name === item.color);
                    if (colorIndex !== -1) {
                        const newStock = product.colors[colorIndex].stock - item.quantity;
                        product.colors[colorIndex].stock = newStock >= 0 ? newStock : 0;
                    }
                }
                // Decrement total stock for the product
                const newTotalStock = product.stock - item.quantity;
                product.stock = newTotalStock >= 0 ? newTotalStock : 0;
                
                productsMap.set(product.id, product);
            }
        });

        return Array.from(productsMap.values());
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({...prev, ...newSettings }));
  };


  const value = {
    products,
    categories,
    orders,
    settings,
    addProduct,
    addProducts,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addOrder,
    updateOrderStatus,
    updateSettings,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
