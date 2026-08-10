import { Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const nodes = [
  {
    id: "gateway",
    label: "API Gateway",
    tech: "Spring Cloud Gateway",
    x: 320,
    y: 40,
    r: 22,
  },

  {
    id: "auth",
    label: "Authentication",
    tech: "Spring Security + JWT",
    x: 320,
    y: 120,
    r: 22,
  },

  {
    id: "dashboard",
    label: "Dashboard",
    tech: "Aggregator Service",
    x: 320,
    y: 205,
    r: 24,
  },

  {
    id: "catalog",
    label: "Catalog",
    tech: "PostgreSQL",
    x: 120,
    y: 305,
    r: 20,
  },

  {
    id: "user",
    label: "User Profile",
    tech: "User Service",
    x: 320,
    y: 305,
    r: 20,
  },

  {
    id: "order",
    label: "Order",
    tech: "OpenFeign",
    x: 520,
    y: 305,
    r: 20,
  },

  {
    id: "payment",
    label: "Payment",
    tech: "REST API",
    x: 520,
    y: 405,
    r: 20,
  },
];

const edges = [
  ["gateway", "auth"],
  ["auth", "dashboard"],

  ["dashboard", "catalog"],
  ["dashboard", "user"],

  ["catalog", "order"],

  ["order", "payment"],
];

export default function AnimatedNetwork() {
  const theme = useTheme();

  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const getNode = (id) => nodes.find((n) => n.id === id);

  return (
    <Box
      mt={5}
      display="flex"
      justifyContent="center"
    >
      <svg
        width="640"
        height="470"
        viewBox="0 0 640 470"
      >
        {/* CONNECTIONS */}

        {edges.map(([from, to], index) => {
          const start = getNode(from);
          const end = getNode(to);

          return (
            <g key={index}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={primary}
                strokeWidth="2"
                strokeOpacity=".25"
              />

              <motion.circle
                r="3.5"
                fill={secondary}
                animate={{
                  cx: [start.x, end.x],
                  cy: [start.y, end.y],
                }}
                transition={{
                  duration: 2.4,
                  ease: "linear",
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
            </g>
          );
        })}

        {/* SERVICES */}

        {nodes.map((node, index) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="#0F172A"
              stroke={primary}
              strokeWidth="2.5"
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                delay: index * 0.18,
              }}
            />

            <circle
              cx={node.x}
              cy={node.y}
              r="7"
              fill={secondary}
            />

            <text
              x={node.x}
              y={node.y + 40}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="600"
              fontFamily="Inter"
            >
              {node.label}
            </text>

            <text
              x={node.x}
              y={node.y + 58}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="11"
              fontFamily="Inter"
            >
              {node.tech}
            </text>
          </g>
        ))}
      </svg>
    </Box>
  );
}