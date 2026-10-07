/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "shdep_cart";

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (e) {
            console.error("Failed to save cart to localStorage", e);
        }
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        if (!product || !product.id) return;

        setCartItems((prevItems) => {
            const existingIndex = prevItems.findIndex((item) => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prevItems];
                const newQty = updated[existingIndex].quantity + quantity;
                const maxStock = product.stockQuantity || 99;
                updated[existingIndex].quantity = Math.min(newQty, maxStock);
                return updated;
            } else {
                return [
                    ...prevItems,
                    {
                        id: product.id,
                        name: product.name,
                        price: Number(product.price || 0),
                        imageUrl: product.imageUrl || "",
                        categoryName: product.categoryName || "",
                        stockQuantity: product.stockQuantity || 99,
                        quantity: Math.min(quantity, product.stockQuantity || 99),
                    },
                ];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === productId) {
                    const maxStock = item.stockQuantity || 99;
                    return {
                        ...item,
                        quantity: Math.min(newQuantity, maxStock),
                    };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const isInCart = (productId) => {
        return cartItems.some((item) => item.id === productId);
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    };

    const getCartTotal = () => {
        return cartItems.reduce(
            (total, item) => total + (Number(item.price || 0) * (item.quantity || 1)),
            0
        );
    };

    const openCartDrawer = () => setIsDrawerOpen(true);
    const closeCartDrawer = () => setIsDrawerOpen(false);
    const toggleCartDrawer = () => setIsDrawerOpen((prev) => !prev);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isInCart,
                getCartCount,
                getCartTotal,
                isDrawerOpen,
                openCartDrawer,
                closeCartDrawer,
                toggleCartDrawer,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
