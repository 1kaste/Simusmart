
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '../../data/mock-data';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number = 1, color?: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id && item.color === color);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      
      let availableStock = product.stock;
      if (color && product.colors) {
        const colorVariation = product.colors.find(c => c.name === color);
        availableStock = colorVariation ? colorVariation.stock : 0;
      }
      
      if (currentQuantityInCart + quantity > availableStock) {
        alert(`Sorry, we only have ${availableStock} units of ${product.name}${color ? ` (${color})` : ''} in stock.`);
        return prevItems;
      }
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity, color }];
      }
    });
    alert(`${product.name}${color ? ` (${color})` : ''} added to cart!`);
  };

  const removeFromCart = (productId: string, color?: string) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.product.id === productId && item.color === color)));
  };
  
  const updateQuantity = (productId: string, quantity: number, color?: string) => {
    setCartItems(prevItems => {
        const itemToUpdate = prevItems.find(item => item.product.id === productId && item.color === color);
        if (!itemToUpdate) return prevItems;

        let availableStock = itemToUpdate.product.stock;
        if (color && itemToUpdate.product.colors) {
            const colorVariation = itemToUpdate.product.colors.find(c => c.name === color);
            availableStock = colorVariation ? colorVariation.stock : 0;
        }

        if (quantity > availableStock) {
            alert(`Sorry, we only have ${availableStock} units of ${itemToUpdate.product.name}${color ? ` (${color})` : ''} in stock.`);
            return prevItems.map(item =>
                (item.product.id === productId && item.color === color) ? { ...item, quantity: availableStock } : item
            );
        }

        if (quantity <= 0) {
            return prevItems.filter(item => !(item.product.id === productId && item.color === color));
        }
        return prevItems.map(item =>
            (item.product.id === productId && item.color === color) ? { ...item, quantity } : item
        );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartCount, totalPrice, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
