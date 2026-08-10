import { Box, Chip } from "@mui/material";
import {
  StorageRounded,
  SecurityRounded,
  HubRounded,
  CloudQueueRounded,
  SyncRounded,
  DnsRounded,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const techStack = [
  {
    label: "Spring Boot",
    icon: <StorageRounded fontSize="small" />,
  },
  {
    label: "Kafka",
    icon: <HubRounded fontSize="small" />,
  },
  {
    label: "JWT Security",
    icon: <SecurityRounded fontSize="small" />,
  },
  {
    label: "API Gateway",
    icon: <DnsRounded fontSize="small" />,
  },
  {
    label: "Docker",
    icon: <CloudQueueRounded fontSize="small" />,
  },
  {
    label: "OpenFeign",
    icon: <SyncRounded fontSize="small" />,
  },
];

export default function TechGrid() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: .2 }}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.2,
      }}
    >
      {techStack.map((tech) => (
        <Chip
          key={tech.label}
          icon={tech.icon}
          label={tech.label}
          sx={{
            px: .6,
            height: 38,

            borderRadius: 3,

            color: "#E2E8F0",

            background:
              "rgba(255,255,255,.05)",

            border:
              "1px solid rgba(255,255,255,.08)",

            "& .MuiChip-icon": {
              color: "#60A5FA",
            },

            transition: ".25s",

            "&:hover": {
              background:
                "rgba(37,99,235,.12)",

              borderColor:
                "rgba(96,165,250,.35)",

              transform:
                "translateY(-2px)",
            },
          }}
        />
      ))}
    </Box>
  );
}