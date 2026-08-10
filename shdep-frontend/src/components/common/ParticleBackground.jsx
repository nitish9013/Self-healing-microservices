// import { Box } from "@mui/material";
// import { motion } from "framer-motion";
// import { useMemo } from "react";

// export default function ParticleBackground() {

//   const particles = useMemo(
//     () =>
//       Array.from({ length: 20 }, () => ({
//         left: Math.random() * 100,
//         duration: 8 + Math.random() * 6,
//         delay: Math.random() * 5,
//         size: 3 + Math.random() * 4,
//       })),
//     []
//   );

//   return (
//     <Box
//       sx={{
//         position: "absolute",
//         inset: 0,
//         overflow: "hidden",
//         zIndex: 0,
//       }}
//     >
//       {particles.map((particle, index) => (
//         <motion.div
//           key={index}
//           initial={{
//             y: 100,
//             opacity: 0,
//           }}
//           animate={{
//             y: -900,
//             opacity: [0, 0.8, 0],
//           }}
//           transition={{
//             repeat: Infinity,
//             ease: "linear",
//             duration: particle.duration,
//             delay: particle.delay,
//           }}
//           style={{
//             position: "absolute",
//             left: `${particle.left}%`,
//             bottom: "-20px",
//             width: particle.size,
//             height: particle.size,
//             borderRadius: "50%",
//             background: "#3B82F6",
//             filter: "blur(2px)",
//           }}
//         />
//       ))}
//     </Box>
//   );
// }