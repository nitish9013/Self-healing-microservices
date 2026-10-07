// Wishlist service managing user wishlist items in localStorage and API sync

const getStorageKey = () => {
    const userId = localStorage.getItem("userId") || "guest";
    return `shdep_wishlist_${userId}`;
};

// Initial sample items to showcase when wishlist is first accessed
const DEFAULT_WISHLIST = [
    {
        id: "prod-wl-1",
        name: "Cloud Microservice Orchestrator",
        categoryName: "Cloud Infrastructure",
        price: 2499,
        stockQuantity: 15,
        active: true,
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
        description: "Automated distributed orchestrator with self-healing nodes and real-time Kafka event sync.",
        addedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "prod-wl-2",
        name: "Enterprise Kafka Stream Broker",
        categoryName: "Messaging & Streaming",
        price: 4999,
        stockQuantity: 8,
        active: true,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
        description: "High-throughput, fault-tolerant message streaming cluster with multi-partition replication.",
        addedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "prod-wl-3",
        name: "Zero-Downtime Payment Gateway Node",
        categoryName: "FinTech & Payments",
        price: 1899,
        stockQuantity: 22,
        active: true,
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
        description: "Razorpay-integrated secure transaction microservice with idempotency key protection.",
        addedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    },
];

export const wishlistService = {
    getWishlist: () => {
        try {
            const raw = localStorage.getItem(getStorageKey());
            if (!raw) {
                // Initialize default sample items
                localStorage.setItem(getStorageKey(), JSON.stringify(DEFAULT_WISHLIST));
                return DEFAULT_WISHLIST;
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to read wishlist:", e);
            return [];
        }
    },

    addToWishlist: (product) => {
        if (!product || !product.id) return false;
        try {
            const items = wishlistService.getWishlist();
            const exists = items.some((item) => String(item.id) === String(product.id));
            if (exists) return false;

            const newItem = {
                id: product.id,
                name: product.name || "Product",
                categoryName: product.categoryName || "General",
                price: product.price || 0,
                stockQuantity: product.stockQuantity ?? 1,
                active: product.active ?? true,
                imageUrl: product.imageUrl || "",
                description: product.description || "",
                addedAt: new Date().toISOString(),
            };

            const updated = [newItem, ...items];
            localStorage.setItem(getStorageKey(), JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent("shdep_wishlist_changed", { detail: updated }));
            return true;
        } catch (e) {
            console.error("Failed to add to wishlist:", e);
            return false;
        }
    },

    removeFromWishlist: (productId) => {
        try {
            const items = wishlistService.getWishlist();
            const updated = items.filter((item) => String(item.id) !== String(productId));
            localStorage.setItem(getStorageKey(), JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent("shdep_wishlist_changed", { detail: updated }));
            return true;
        } catch (e) {
            console.error("Failed to remove from wishlist:", e);
            return false;
        }
    },

    isInWishlist: (productId) => {
        if (!productId) return false;
        try {
            const items = wishlistService.getWishlist();
            return items.some((item) => String(item.id) === String(productId));
        } catch {
            return false;
        }
    },

    clearWishlist: () => {
        try {
            localStorage.setItem(getStorageKey(), JSON.stringify([]));
            window.dispatchEvent(new CustomEvent("shdep_wishlist_changed", { detail: [] }));
            return true;
        } catch {
            return false;
        }
    },
};

export default wishlistService;
