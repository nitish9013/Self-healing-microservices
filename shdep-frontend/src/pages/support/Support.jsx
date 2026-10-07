import { useState, useCallback } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    TextField,
    MenuItem,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from "@mui/material";

import {
    HelpOutlineRounded,
    SupportAgentRounded,
    ConfirmationNumberRounded,
    QuestionAnswerRounded,
    SendRounded,
    ExpandMoreRounded,
    AccessTimeRounded,
    EmailOutlined,
    PhoneInTalkRounded,
    CheckCircleRounded,
    FiberManualRecordRounded,
} from "@mui/icons-material";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Sidebar from "../../components/dashboard/Sidebar";
import supportService from "../../services/supportService";

const FAQ_LIST = [
    {
        category: "Orders & Delivery",
        question: "How does asynchronous order confirmation work in SHDEP?",
        answer: "When you place an order, the Order microservice creates an order with PENDING status. Once Razorpay confirms the transaction, a PaymentCompletedEvent is published onto Apache Kafka. The Order service consumes this event and automatically updates the order status to PAID.",
    },
    {
        category: "Orders & Delivery",
        question: "Can I cancel an order after placing it?",
        answer: "You can request cancellation for orders that are still in PENDING or CREATED state. Once an order is marked PAID and processing has begun, you can open a support ticket to initiate a refund.",
    },
    {
        category: "Payments & Refunds",
        question: "What payment methods are supported?",
        answer: "Our Payment microservice integrates with Razorpay, supporting UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, MasterCard, RuPay), Net Banking, and Digital Wallets.",
    },
    {
        category: "Payments & Refunds",
        question: "How long does a refund take if a payment fails?",
        answer: "If money is deducted for a failed transaction, Razorpay automatically reconciles with your issuing bank within 3 to 5 business days.",
    },
    {
        category: "Microservices & Self-Healing",
        question: "What is the Self-Healing mechanism in this platform?",
        answer: "SHDEP microservices feature automated circuit breakers, Kafka event replays, dead-letter queues, and heartbeat health monitors. If a downstream service fails or restarts, incoming requests are buffered or gracefully recovered without data loss.",
    },
    {
        category: "Account & Security",
        question: "How does session authentication work?",
        answer: "The platform uses Stateless JWT (JSON Web Tokens) with role-based access control (USER, SALESMAN, ADMIN). Tokens are validated via the Spring Cloud API Gateway.",
    },
];

export default function Support() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [tickets, setTickets] = useState(() => supportService.getTickets());
    const [notification, setNotification] = useState("");
    const [expandedTicket, setExpandedTicket] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        subject: "",
        category: "Order Issue",
        priority: "Medium",
        orderId: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const loadTickets = useCallback(() => {
        const loaded = supportService.getTickets();
        setTickets(loaded);
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        if (!formData.subject.trim() || !formData.message.trim()) {
            setNotification("Please fill in both Subject and Message.");
            return;
        }

        try {
            setSubmitting(true);
            const created = supportService.createTicket({
                subject: formData.subject.trim(),
                category: formData.category,
                priority: formData.priority,
                orderId: formData.orderId.trim(),
                message: formData.message.trim(),
            });

            setSuccessMessage(`Ticket #${created.id} created successfully! Our team has been notified.`);
            setFormData({
                subject: "",
                category: "Order Issue",
                priority: "Medium",
                orderId: "",
                message: "",
            });
            loadTickets();
            setCurrentTab(1); // Switch to My Tickets tab
        } catch {
            setNotification("Failed to create ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseTicket = (ticketId) => {
        supportService.closeTicket(ticketId);
        loadTickets();
        setNotification(`Ticket #${ticketId} marked as Resolved.`);
    };

    const getPriorityColor = (priority) => {
        switch (String(priority || "").toUpperCase()) {
            case "CRITICAL":
            case "HIGH":
                return { bg: "rgba(239,68,68,.15)", text: "#FCA5A5", border: "rgba(239,68,68,.3)" };
            case "MEDIUM":
                return { bg: "rgba(245,158,11,.15)", text: "#FCD34D", border: "rgba(245,158,11,.3)" };
            case "LOW":
            default:
                return { bg: "rgba(59,130,246,.15)", text: "#93C5FD", border: "rgba(59,130,246,.3)" };
        }
    };

    const getStatusColor = (status) => {
        switch (String(status || "").toUpperCase()) {
            case "RESOLVED":
                return { bg: "rgba(34,197,94,.15)", text: "#86EFAC", border: "rgba(34,197,94,.3)" };
            case "IN PROGRESS":
                return { bg: "rgba(59,130,246,.15)", text: "#93C5FD", border: "rgba(59,130,246,.3)" };
            case "OPEN":
            default:
                return { bg: "rgba(245,158,11,.15)", text: "#FCD34D", border: "rgba(245,158,11,.3)" };
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                background: "linear-gradient(135deg, #080F23 0%, #0F172A 55%, #111827 100%)",
                color: "#fff",
            }}
        >
            {/* TOP HEADER */}
            <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />

            {/* SIDEBAR + MAIN CONTENT */}
            <Box sx={{ display: "flex", width: "100%" }}>
                <Sidebar
                    mobileOpen={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1600,
                            mx: "auto",
                            px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
                            py: { xs: 3, md: 4 },
                        }}
                    >
                        {/* HEADER BANNER */}
                        <Box
                            sx={{
                                p: { xs: 3, md: 4 },
                                mb: 4,
                                borderRadius: 4,
                                background:
                                    "linear-gradient(135deg, rgba(37,99,235,.15) 0%, rgba(30,41,59,.8) 100%)",
                                border: "1px solid rgba(59,130,246,.25)",
                                backdropFilter: "blur(20px)",
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                alignItems: { xs: "flex-start", md: "center" },
                                justifyContent: "space-between",
                                gap: 3,
                            }}
                        >
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.8, mb: 1 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 3,
                                            background: "rgba(59,130,246,.15)",
                                            border: "1px solid rgba(59,130,246,.3)",
                                            color: "#60A5FA",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <SupportAgentRounded sx={{ fontSize: 28 }} />
                                    </Box>
                                    <div>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 800,
                                                color: "#F8FAFC",
                                                fontSize: { xs: 22, md: 28 },
                                                letterSpacing: "-.5px",
                                            }}
                                        >
                                            Help & Support Center
                                        </Typography>
                                        <Typography sx={{ color: "#94A3B8", fontSize: 13, mt: 0.3 }}>
                                            Need assistance with orders, payments, or microservice infrastructure? We're here for you.
                                        </Typography>
                                    </div>
                                </Box>

                                {/* STATUS INDICATORS */}
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
                                    <Chip
                                        icon={
                                            <FiberManualRecordRounded
                                                sx={{
                                                    fontSize: "12px !important",
                                                    color: "#4ADE80 !important",
                                                    animation: "pulse 2s infinite",
                                                }}
                                            />
                                        }
                                        label="All Microservices Operational"
                                        sx={{
                                            background: "rgba(34,197,94,.1)",
                                            color: "#86EFAC",
                                            border: "1px solid rgba(34,197,94,.2)",
                                            fontWeight: 600,
                                            fontSize: 12,
                                        }}
                                    />
                                    <Chip
                                        icon={<AccessTimeRounded sx={{ fontSize: "16px !important", color: "#93C5FD !important" }} />}
                                        label="Avg Response: < 15 Mins"
                                        sx={{
                                            background: "rgba(59,130,246,.1)",
                                            color: "#93C5FD",
                                            border: "1px solid rgba(59,130,246,.2)",
                                            fontWeight: 600,
                                            fontSize: 12,
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* EMERGENCY CONTACT BUTTONS */}
                            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<EmailOutlined />}
                                    href="mailto:support@shdep.dev"
                                    sx={{
                                        borderRadius: 2.5,
                                        color: "#CBD5E1",
                                        borderColor: "rgba(255,255,255,.12)",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            borderColor: "#3B82F6",
                                            background: "rgba(59,130,246,.1)",
                                        },
                                    }}
                                >
                                    Email Support
                                </Button>
                            </Box>
                        </Box>

                        {/* SUCCESS FEEDBACK */}
                        {successMessage && (
                            <Alert
                                severity="success"
                                onClose={() => setSuccessMessage("")}
                                sx={{
                                    mb: 3,
                                    background: "rgba(34,197,94,.1)",
                                    color: "#86EFAC",
                                    border: "1px solid rgba(34,197,94,.25)",
                                }}
                            >
                                {successMessage}
                            </Alert>
                        )}

                        {/* NAVIGATION TABS */}
                        <Box sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,.08)", mb: 4 }}>
                            <Tabs
                                value={currentTab}
                                onChange={(e, val) => setCurrentTab(val)}
                                sx={{
                                    "& .MuiTab-root": {
                                        color: "#64748B",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        textTransform: "none",
                                        minHeight: 48,
                                        "&.Mui-selected": { color: "#60A5FA" },
                                    },
                                    "& .MuiTabs-indicator": { background: "#3B82F6", height: 3, borderRadius: 2 },
                                }}
                            >
                                <Tab
                                    icon={<ConfirmationNumberRounded sx={{ fontSize: 18 }} />}
                                    iconPosition="start"
                                    label="Submit Ticket"
                                />
                                <Tab
                                    icon={<QuestionAnswerRounded sx={{ fontSize: 18 }} />}
                                    iconPosition="start"
                                    label={`My Tickets (${tickets.length})`}
                                />
                                <Tab
                                    icon={<HelpOutlineRounded sx={{ fontSize: 18 }} />}
                                    iconPosition="start"
                                    label="Knowledge Base / FAQ"
                                />
                            </Tabs>
                        </Box>

                        {/* TAB 0: CREATE TICKET FORM */}
                        {currentTab === 0 && (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
                                    gap: 3,
                                }}
                            >
                                <Card
                                    elevation={0}
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        borderRadius: 4,
                                        background: "rgba(18,28,48,.7)",
                                        border: "1px solid rgba(255,255,255,.08)",
                                        backdropFilter: "blur(20px)",
                                    }}
                                >
                                    <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700, mb: 1 }}>
                                        Create New Support Ticket
                                    </Typography>
                                    <Typography sx={{ color: "#94A3B8", fontSize: 13, mb: 3 }}>
                                        Please describe the issue in detail so our engineering team can assist you rapidly.
                                    </Typography>

                                    <form onSubmit={handleSubmitTicket}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                            <TextField
                                                fullWidth
                                                label="Subject / Issue Title"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Order #105 payment status not updating"
                                                required
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2.5,
                                                        background: "rgba(255,255,255,.03)",
                                                        color: "#fff",
                                                        "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                    },
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                                                    gap: 2,
                                                }}
                                            >
                                                <TextField
                                                    select
                                                    label="Issue Category"
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2.5,
                                                            background: "rgba(255,255,255,.03)",
                                                            color: "#fff",
                                                            "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="Order Issue">Order Issue</MenuItem>
                                                    <MenuItem value="Payment Failure">Payment Failure</MenuItem>
                                                    <MenuItem value="Catalog Query">Catalog / Product Query</MenuItem>
                                                    <MenuItem value="Account & Security">Account & Security</MenuItem>
                                                    <MenuItem value="Microservices Bug">Microservice / Technical Bug</MenuItem>
                                                    <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                                                </TextField>

                                                <TextField
                                                    select
                                                    label="Priority"
                                                    name="priority"
                                                    value={formData.priority}
                                                    onChange={handleInputChange}
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2.5,
                                                            background: "rgba(255,255,255,.03)",
                                                            color: "#fff",
                                                            "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="Low">Low</MenuItem>
                                                    <MenuItem value="Medium">Medium</MenuItem>
                                                    <MenuItem value="High">High</MenuItem>
                                                    <MenuItem value="Critical">Critical / Blocker</MenuItem>
                                                </TextField>
                                            </Box>

                                            <TextField
                                                fullWidth
                                                label="Associated Order ID or Payment ID (Optional)"
                                                name="orderId"
                                                value={formData.orderId}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 102 or pay_Onk28Xal"
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2.5,
                                                        background: "rgba(255,255,255,.03)",
                                                        color: "#fff",
                                                        "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                    },
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Detailed Description"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                placeholder="Describe what occurred, expected outcome, or error message..."
                                                required
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2.5,
                                                        background: "rgba(255,255,255,.03)",
                                                        color: "#fff",
                                                        "& fieldset": { borderColor: "rgba(255,255,255,.1)" },
                                                    },
                                                }}
                                            />

                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={submitting}
                                                startIcon={<SendRounded />}
                                                sx={{
                                                    py: 1.5,
                                                    borderRadius: 2.5,
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    fontSize: 15,
                                                    background: "linear-gradient(90deg, #2563EB, #0EA5E9)",
                                                    "&:hover": {
                                                        background: "linear-gradient(90deg, #1D4ED8, #0284C7)",
                                                    },
                                                }}
                                            >
                                                {submitting ? "Submitting Ticket..." : "Submit Support Ticket"}
                                            </Button>
                                        </Box>
                                    </form>
                                </Card>

                                {/* SIDE INFO CARDS */}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 4,
                                            background: "rgba(18,28,48,.7)",
                                            border: "1px solid rgba(255,255,255,.08)",
                                        }}
                                    >
                                        <Typography sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16, mb: 1 }}>
                                            Live Support Channels
                                        </Typography>
                                        <Typography sx={{ color: "#94A3B8", fontSize: 13, mb: 2.5 }}>
                                            Reach out directly via our dedicated enterprise channels:
                                        </Typography>

                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: 2,
                                                        background: "rgba(59,130,246,.12)",
                                                        color: "#60A5FA",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <EmailOutlined sx={{ fontSize: 18 }} />
                                                </Box>
                                                <div>
                                                    <Typography sx={{ color: "#CBD5E1", fontSize: 12, fontWeight: 600 }}>
                                                        Email Desk
                                                    </Typography>
                                                    <Typography sx={{ color: "#94A3B8", fontSize: 12 }}>
                                                        support@shdep.dev
                                                    </Typography>
                                                </div>
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: 2,
                                                        background: "rgba(34,197,94,.12)",
                                                        color: "#4ADE80",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <PhoneInTalkRounded sx={{ fontSize: 18 }} />
                                                </Box>
                                                <div>
                                                    <Typography sx={{ color: "#CBD5E1", fontSize: 12, fontWeight: 600 }}>
                                                        Emergency Line
                                                    </Typography>
                                                    <Typography sx={{ color: "#94A3B8", fontSize: 12 }}>
                                                        +91 1800-SHDEP-OPS
                                                    </Typography>
                                                </div>
                                            </Box>
                                        </Box>
                                    </Card>

                                    <Card
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 4,
                                            background: "rgba(18,28,48,.7)",
                                            border: "1px solid rgba(255,255,255,.08)",
                                        }}
                                    >
                                        <Typography sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16, mb: 1 }}>
                                            Self-Healing SLA
                                        </Typography>
                                        <Typography sx={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6 }}>
                                            SHDEP systems monitor Kafka topic lags, payment idempotency, and container health 24/7.
                                            Critical issues trigger automated alerts and sub-minute failovers.
                                        </Typography>
                                    </Card>
                                </Box>
                            </Box>
                        )}

                        {/* TAB 1: MY TICKETS LIST */}
                        {currentTab === 1 && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                {tickets.length > 0 ? (
                                    tickets.map((ticket) => {
                                        const pColor = getPriorityColor(ticket.priority);
                                        const sColor = getStatusColor(ticket.status);
                                        const isExpanded = expandedTicket === ticket.id;

                                        return (
                                            <Card
                                                key={ticket.id}
                                                elevation={0}
                                                sx={{
                                                    borderRadius: 3.5,
                                                    background: "rgba(18,28,48,.7)",
                                                    border: "1px solid rgba(255,255,255,.08)",
                                                    backdropFilter: "blur(20px)",
                                                    overflow: "hidden",
                                                    transition: "all .2s ease",
                                                    "&:hover": { borderColor: "rgba(59,130,246,.3)" },
                                                }}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: { xs: "column", sm: "row" },
                                                            justifyContent: "space-between",
                                                            alignItems: { xs: "flex-start", sm: "center" },
                                                            gap: 2,
                                                            mb: 1.5,
                                                        }}
                                                    >
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                                            <Typography sx={{ color: "#60A5FA", fontWeight: 800, fontSize: 14 }}>
                                                                #{ticket.id}
                                                            </Typography>
                                                            <Chip
                                                                label={ticket.category}
                                                                size="small"
                                                                sx={{
                                                                    background: "rgba(255,255,255,.06)",
                                                                    color: "#CBD5E1",
                                                                    fontSize: 11,
                                                                    fontWeight: 600,
                                                                }}
                                                            />
                                                            <Chip
                                                                label={ticket.priority}
                                                                size="small"
                                                                sx={{
                                                                    background: pColor.bg,
                                                                    color: pColor.text,
                                                                    border: `1px solid ${pColor.border}`,
                                                                    fontSize: 11,
                                                                    fontWeight: 700,
                                                                }}
                                                            />
                                                            <Chip
                                                                label={ticket.status}
                                                                size="small"
                                                                sx={{
                                                                    background: sColor.bg,
                                                                    color: sColor.text,
                                                                    border: `1px solid ${sColor.border}`,
                                                                    fontSize: 11,
                                                                    fontWeight: 700,
                                                                }}
                                                            />
                                                        </Box>

                                                        <Typography sx={{ color: "#64748B", fontSize: 12 }}>
                                                            {new Date(ticket.createdAt).toLocaleDateString()} at{" "}
                                                            {new Date(ticket.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                        </Typography>
                                                    </Box>

                                                    <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 17, mb: 1 }}>
                                                        {ticket.subject}
                                                    </Typography>

                                                    <Typography sx={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6, mb: 2 }}>
                                                        {ticket.message}
                                                    </Typography>

                                                    {ticket.orderId && (
                                                        <Typography sx={{ color: "#60A5FA", fontSize: 12, mb: 2 }}>
                                                            Linked Order/Reference: #{ticket.orderId}
                                                        </Typography>
                                                    )}

                                                    {/* REPLIES / THREAD */}
                                                    {isExpanded && ticket.replies && ticket.replies.length > 0 && (
                                                        <Box
                                                            sx={{
                                                                mt: 2,
                                                                pt: 2,
                                                                borderTop: "1px solid rgba(255,255,255,.08)",
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: 1.5,
                                                            }}
                                                        >
                                                            <Typography sx={{ color: "#CBD5E1", fontSize: 12, fontWeight: 700 }}>
                                                                Support Updates ({ticket.replies.length}):
                                                            </Typography>
                                                            {ticket.replies.map((reply, idx) => (
                                                                <Box
                                                                    key={idx}
                                                                    sx={{
                                                                        p: 2,
                                                                        borderRadius: 2.5,
                                                                        background: "rgba(59,130,246,.08)",
                                                                        border: "1px solid rgba(59,130,246,.15)",
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                                                        <Typography sx={{ color: "#93C5FD", fontWeight: 700, fontSize: 12 }}>
                                                                            {reply.sender} ({reply.role})
                                                                        </Typography>
                                                                        <Typography sx={{ color: "#64748B", fontSize: 11 }}>
                                                                            {new Date(reply.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography sx={{ color: "#E2E8F0", fontSize: 13, lineHeight: 1.5 }}>
                                                                        {reply.text}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    )}

                                                    {/* TICKET ACTIONS */}
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                                                        <Button
                                                            size="small"
                                                            onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                                                            sx={{ color: "#60A5FA", textTransform: "none", fontSize: 12, fontWeight: 600 }}
                                                        >
                                                            {isExpanded ? "Hide Details" : "View Discussion Thread"}
                                                        </Button>

                                                        {ticket.status !== "Resolved" && (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="success"
                                                                startIcon={<CheckCircleRounded />}
                                                                onClick={() => handleCloseTicket(ticket.id)}
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    textTransform: "none",
                                                                    fontSize: 12,
                                                                    borderColor: "rgba(34,197,94,.3)",
                                                                    color: "#86EFAC",
                                                                }}
                                                            >
                                                                Mark Resolved
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <Box
                                        sx={{
                                            py: 8,
                                            textAlign: "center",
                                            borderRadius: 4,
                                            background: "rgba(18,28,48,.6)",
                                            border: "1px dashed rgba(255,255,255,.1)",
                                        }}
                                    >
                                        <Typography sx={{ color: "#CBD5E1", fontSize: 16, fontWeight: 700 }}>
                                            No support tickets found
                                        </Typography>
                                        <Typography sx={{ color: "#64748B", fontSize: 13, mt: 0.5 }}>
                                            You haven't submitted any tickets yet. Switch to "Submit Ticket" if you need help.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* TAB 2: KNOWLEDGE BASE / FAQ */}
                        {currentTab === 2 && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                {FAQ_LIST.map((faq, index) => (
                                    <Accordion
                                        key={index}
                                        elevation={0}
                                        sx={{
                                            borderRadius: "14px !important",
                                            background: "rgba(18,28,48,.7)",
                                            border: "1px solid rgba(255,255,255,.08)",
                                            backdropFilter: "blur(20px)",
                                            mb: 1.5,
                                            "&:before": { display: "none" },
                                        }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreRounded sx={{ color: "#60A5FA" }} />}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Chip
                                                    label={faq.category}
                                                    size="small"
                                                    sx={{
                                                        background: "rgba(59,130,246,.12)",
                                                        color: "#93C5FD",
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                    }}
                                                />
                                                <Typography sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 15 }}>
                                                    {faq.question}
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ pt: 0, pb: 2.5, px: 3 }}>
                                            <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,.06)" }} />
                                            <Typography sx={{ color: "#94A3B8", fontSize: 14, lineHeight: 1.7 }}>
                                                {faq.answer}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* NOTIFICATION TOAST */}
            <Snackbar
                open={Boolean(notification)}
                autoHideDuration={3500}
                onClose={() => setNotification("")}
                message={notification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
        </Box>
    );
}
