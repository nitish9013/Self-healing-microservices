// Support service for tickets and knowledge base

const getStorageKey = () => {
    const userId = localStorage.getItem("userId") || "guest";
    return `shdep_support_tickets_${userId}`;
};

const DEFAULT_TICKETS = [
    {
        id: "TKT-8291",
        subject: "Payment verification delay on Order #104",
        category: "Payment",
        priority: "High",
        status: "Resolved",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        orderId: "104",
        message: "I completed the payment via UPI, but the order status took 5 minutes to transition to PAID. Can you verify if Kafka event was delayed?",
        replies: [
            {
                sender: "SHDEP Support Engineer",
                role: "Support Team",
                time: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
                text: "Hello! We inspected the Kafka PaymentCompletedEvent logs. The partition rebalance caused a temporary 30-second delay, after which the event was consumed successfully and marked PAID. Your order is confirmed!",
            },
        ],
    },
    {
        id: "TKT-8412",
        subject: "Catalog product availability query",
        category: "Catalog",
        priority: "Medium",
        status: "In Progress",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        orderId: "",
        message: "When will the Distributed Cache Cluster module be back in stock in the catalog?",
        replies: [
            {
                sender: "SHDEP Catalog Admin",
                role: "Support Team",
                time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                text: "Hi there! Our engineering team is restocking new license clusters this Friday. You can add it to your Wishlist to get immediate updates.",
            },
        ],
    },
];

export const supportService = {
    getTickets: () => {
        try {
            const raw = localStorage.getItem(getStorageKey());
            if (!raw) {
                localStorage.setItem(getStorageKey(), JSON.stringify(DEFAULT_TICKETS));
                return DEFAULT_TICKETS;
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to read tickets:", e);
            return [];
        }
    },

    createTicket: ({ subject, category, priority, message, orderId = "" }) => {
        try {
            const tickets = supportService.getTickets();
            const ticketNumber = Math.floor(1000 + Math.random() * 9000);
            const newTicket = {
                id: `TKT-${ticketNumber}`,
                subject,
                category: category || "General",
                priority: priority || "Medium",
                status: "Open",
                createdAt: new Date().toISOString(),
                orderId,
                message,
                replies: [
                    {
                        sender: "SHDEP Automated AI Support",
                        role: "System Bot",
                        time: new Date().toISOString(),
                        text: "Your ticket has been received and registered. An engineer from the Self-Healing Platform team will review it shortly.",
                    },
                ],
            };

            const updated = [newTicket, ...tickets];
            localStorage.setItem(getStorageKey(), JSON.stringify(updated));
            return newTicket;
        } catch (e) {
            console.error("Failed to create ticket:", e);
            throw e;
        }
    },

    closeTicket: (ticketId) => {
        try {
            const tickets = supportService.getTickets();
            const updated = tickets.map((t) =>
                t.id === ticketId ? { ...t, status: "Resolved" } : t
            );
            localStorage.setItem(getStorageKey(), JSON.stringify(updated));
            return true;
        } catch {
            return false;
        }
    },
};

export default supportService;
