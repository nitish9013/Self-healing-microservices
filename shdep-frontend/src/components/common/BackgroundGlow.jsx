import { Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function BackgroundGlow() {
  return (
    <>
      {/* Main Background */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          zIndex: -20,
          background:
            "linear-gradient(135deg,#020617 0%,#071226 45%,#020617 100%)",
        }}
      />

      {/* Blue Glow */}
      <MotionBox
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        sx={{
          position: "fixed",
          width: 520,
          height: 520,
          top: -120,
          left: -120,
          borderRadius: "50%",
          filter: "blur(130px)",
          background: "rgba(37,99,235,.28)",
          zIndex: -19,
        }}
      />

      {/* Cyan Glow */}
      <MotionBox
        animate={{
          x: [0, -70, 40, 0],
          y: [0, 40, -30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        sx={{
          position: "fixed",
          width: 430,
          height: 430,
          right: -120,
          bottom: -120,
          borderRadius: "50%",
          filter: "blur(120px)",
          background: "rgba(14,165,233,.22)",
          zIndex: -19,
        }}
      />

      {/* Center Glow */}
      <MotionBox
        animate={{
          opacity: [0.18, 0.28, 0.18],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        sx={{
          position: "fixed",
          width: 650,
          height: 650,
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          filter: "blur(160px)",
          background:
            "radial-gradient(circle,rgba(59,130,246,.18),transparent 70%)",
          zIndex: -18,
        }}
      />

      {/* Grid Overlay */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          opacity: .06,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at center, black 45%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 45%, transparent 95%)",
          zIndex: -17,
        }}
      />

      {/* Noise Layer */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          opacity: .03,
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "8px 8px",
          zIndex: -16,
        }}
      />
    </>
  );
}