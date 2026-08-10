import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

import Logo from "../common/Logo";
import TechGrid from "../common/TechGrid";
import ArchitectureDiagram from "../common/ArchitectureDiagram";

export default function BrandingPanel() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      sx={{
        width: "100%",
        maxWidth: 500,

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        color: "white",
      }}
    >
      {/* Logo */}

      <Logo />

      {/* Heading */}

      <Typography
        variant="h3"
        sx={{
          mt: 4,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
        }}
      >
       
        Self-Healing
        <br />
        Distributed Event
        <br />
        Platform
      </Typography>

      {/* Description */}

      <Typography
        sx={{
          mt: 2.5,
          color: "#94A3B8",
          lineHeight: 1.95,
          fontSize: 15,
        }}
      >
        Enterprise backend platform powered by Spring Boot,
        Kafka, API Gateway, JWT Authentication and
        Resilience4j for highly available distributed
        microservices.
      </Typography>

      {/* Core Stack */}

      <Box mt={5}>
        <Typography
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: 15,
            color: "#E2E8F0",
            gap:1.2,
          }}
        >
          Core Technologies
        </Typography>

        <TechGrid />
      </Box>

      {/* Architecture */}

      <Box mt={5}>
        <Typography
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: 15,
            color: "#E2E8F0",
          }}
        >
          Service Architecture
        </Typography>

        <ArchitectureDiagram />
      </Box>

      {/* Bottom Line */}

      <Typography
        sx={{
          mt: 4,
          fontSize: 13,
          color: "#64748B",
          lineHeight: 1.7,
        }}
      >
        Designed for secure authentication, resilient service
        communication and scalable cloud deployment.
      </Typography>
    </Box>
  );
}