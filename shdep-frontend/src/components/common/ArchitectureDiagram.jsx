import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

import HubRoundedIcon from "@mui/icons-material/HubRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";

const MotionBox = motion(Box);

const iconStyle = {
  fontSize: 18,
};

const nodes = {
  gateway: {
    icon: <HubRoundedIcon sx={iconStyle} />,
    label: "Gateway",
  },

  auth: {
    icon: <SecurityRoundedIcon sx={iconStyle} />,
    label: "Authentication",
  },

  dashboard: {
    icon: <DashboardRoundedIcon sx={iconStyle} />,
    label: "Dashboard",
  },

  catalog: {
    icon: <Inventory2RoundedIcon sx={iconStyle} />,
    label: "Catalog",
  },

  user: {
    icon: <PersonRoundedIcon sx={iconStyle} />,
    label: "User",
  },

  order: {
    icon: <ShoppingCartRoundedIcon sx={iconStyle} />,
    label: "Order",
  },

  payment: {
    icon: <PaymentsRoundedIcon sx={iconStyle} />,
    label: "Payment",
  },
};

function Node({
  icon,
  label,
  delay = 0,
}) {
  return (
    <MotionBox
      initial={{
        opacity: 0,
        scale: .8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: .35,
        delay,
      }}
      whileHover={{
        scale: 1.06,
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: .8,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,

          borderRadius: "50%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          color: "#E2E8F0",

          background:
            "linear-gradient(135deg,#2563EB,#0EA5E9)",

          boxShadow:
            "0 0 22px rgba(37,99,235,.35)",

          border:
            "1px solid rgba(255,255,255,.12)",
        }}
      >
        {icon}
      </Box>

      <Typography
        fontSize={12}
        fontWeight={600}
        color="#CBD5E1"
      >
        {label}
      </Typography>
    </MotionBox>
  );
}

function VerticalLine({
  height = 18,
}) {
  return (
    <Box
      sx={{
        width: 2,
        height,

        background:
          "linear-gradient(to bottom,#38BDF8,rgba(56,189,248,.15))",
      }}
    />
  );
}

function HorizontalLine() {
  return (
    <Box
      sx={{
        height: 2,
        flex: 1,

        background:
          "linear-gradient(to right,#38BDF8,rgba(56,189,248,.15))",
      }}
    />
  );
}

function StatusBadge({
  title,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,

        px: 1.5,
        py: .7,

        borderRadius: 999,

        background:
          "rgba(255,255,255,.04)",

        border:
          "1px solid rgba(255,255,255,.08)",
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,

          borderRadius: "50%",

          bgcolor: "#22C55E",

          boxShadow:
            "0 0 10px #22C55E",
        }}
      />

      <Typography
        fontSize={11}
        color="#CBD5E1"
      >
        {title}
      </Typography>
    </Box>
  );
}
function ArchitectureDiagram() {
  return (
    <Box
      sx={{
        mt: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Gateway */}

      <Node
        icon={nodes.gateway.icon}
        label={nodes.gateway.label}
        delay={0}
      />

      <VerticalLine />

      {/* Authentication */}

      <Node
        icon={nodes.auth.icon}
        label={nodes.auth.label}
        delay={0.08}
      />

      <VerticalLine />

      {/* Dashboard */}

      <Node
        icon={nodes.dashboard.icon}
        label={nodes.dashboard.label}
        delay={0.16}
      />

      {/* Branch */}

      <Box
        sx={{
          width: 250,
          mt: 2,
          mb: 1,
        }}
      >
        {/* Top Connector */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <HorizontalLine />

          <Box
            sx={{
              width: 2,
              height: 18,
              bgcolor: "#38BDF8",
            }}
          />

          <HorizontalLine />
        </Box>

        {/* Catalog & User */}

        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Node
            icon={nodes.catalog.icon}
            label={nodes.catalog.label}
            delay={0.24}
          />

          <Node
            icon={nodes.user.icon}
            label={nodes.user.label}
            delay={0.30}
          />
        </Box>
      </Box>

      <VerticalLine height={18} />

      {/* Order + Payment */}

      <Box
        sx={{
          width: 230,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Node
          icon={nodes.order.icon}
          label={nodes.order.label}
          delay={0.38}
        />

        <HorizontalLine />

        <Node
          icon={nodes.payment.icon}
          label={nodes.payment.label}
          delay={0.46}
        />
      </Box>

      {/* Status */}

      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <StatusBadge title="Healthy" />
        <StatusBadge title="JWT Enabled" />
        <StatusBadge title="99.98% Uptime" />
      </Box>
    </Box>
  );
}

export default ArchitectureDiagram;