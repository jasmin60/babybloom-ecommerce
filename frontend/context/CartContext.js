'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: 0 });
  const { user } = useAuth();

  useEffect(() => {
    const localCartData = localStorage.getItem('bb_workspace_cart');
    if (localCartData) {
      try {
        setCart(JSON.parse(localCartData));
      } catch (e) {
        console.error("Corrupted local storage payload:", e);
      }
    }
  }, []);

  const saveCartState = (updatedItems) => {
    const total_items = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const total_price = updatedItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    
    const newCartState = { items: updatedItems, total_items, total_price };
    setCart(newCartState);
    localStorage.setItem('bb_workspace_cart', JSON.stringify(newCartState));
  };

  const add = async (productId, quantity = 1) => {
    if (!Cookies.get('access_token')) {
      toast.error('Please log in to add items to your cart.');
      return false;
    }

    try {
      const token = Cookies.get('access_token');
      // 🚀 FIXED: Dynamic production resolution path variable mapping
      const res = await fetch(`${API_BASE}/products/${productId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const targetProduct = await res.json();

      if (!targetProduct || !targetProduct.id) {
        toast.error('Product specification tracking out of bounds.');
        return false;
      }

      const existingItems = [...cart.items];
      const itemIndex = existingItems.findIndex(item => item.product.id === productId);

      if (itemIndex > -1) {
        existingItems[itemIndex].quantity += quantity;
        existingItems[itemIndex].subtotal = existingItems[itemIndex].quantity * targetProduct.price;
      } else {
        existingItems.push({
          id: `local_${Date.now()}`,
          product: targetProduct,
          quantity: quantity,
          subtotal: targetProduct.price * quantity
        });
      }

      saveCartState(existingItems);
      toast.success('Added to basket matrix! 🍼');
      return true;

    } catch (err) {
      console.error(err);
      toast.error('Could not update basket metrics array.');
      return false;
    }
  };

  const updateItem = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    const updatedItems = cart.items.map(item => {
      if (item.id === itemId) {
        const newQty = quantity;
        return { ...item, quantity: newQty, subtotal: newQty * item.product.price };
      }
      return item;
    });
    saveCartState(updatedItems);
  };

  const removeItem = async (itemId) => {
    const filteredItems = cart.items.filter(item => item.id !== itemId);
    saveCartState(filteredItems);
    toast.success('Removed from basket.');
  };

  const empty = useCallback(async () => {
    const clearedState = { items: [], total_items: 0, total_price: 0 };
    setCart(clearedState);
    localStorage.removeItem('bb_workspace_cart');
  }, []);

  return (
    <CartContext.Provider value={{ cart, add, updateItem, removeItem, empty, refreshCart: empty }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);