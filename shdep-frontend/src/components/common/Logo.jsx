import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

export default function Logo({
  size = 68,
  showText = true,
}) {
  const theme = useTheme();

  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        initial={{
          opacity: 0,
          scale: 0.6,
          rotate: -25,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: .8,
          type: "spring",
          stiffness: 120,
        }}
      >
        <defs>

          <linearGradient
            id="gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={primary}
            />

            <stop
              offset="100%"
              stopColor={secondary}
            />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur
              stdDeviation="6"
              result="coloredBlur"
            />

            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

        </defs>

        {/* Glow */}

        <circle
          cx="60"
          cy="60"
          r="42"
          fill={primary}
          opacity=".12"
          filter="url(#glow)"
        />

        {/* Outer Ring */}

        <circle
          cx="60"
          cy="60"
          r="34"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="5"
        />

        {/* Nodes */}

        {[
          [60,24],
          [92,60],
          [60,96],
          [28,60],
        ].map(([x,y],index)=>(
          <motion.circle
            key={index}
            cx={x}
            cy={y}
            r="6"
            fill="url(#gradient)"
            animate={{
              scale:[1,1.25,1],
            }}
            transition={{
              repeat:Infinity,
              duration:2.5,
              delay:index*.25,
            }}
          />
        ))}

        {/* Center */}

        <motion.circle
          cx="60"
          cy="60"
          r="10"
          fill="white"
          animate={{
            scale:[1,1.08,1],
          }}
          transition={{
            repeat:Infinity,
            duration:2,
          }}
        />

        {/* Connections */}

        <line
          x1="60"
          y1="34"
          x2="60"
          y2="50"
          stroke="url(#gradient)"
          strokeWidth="3"
        />

        <line
          x1="70"
          y1="60"
          x2="82"
          y2="60"
          stroke="url(#gradient)"
          strokeWidth="3"
        />

        <line
          x1="60"
          y1="70"
          x2="60"
          y2="86"
          stroke="url(#gradient)"
          strokeWidth="3"
        />

        <line
          x1="38"
          y1="60"
          x2="50"
          y2="60"
          stroke="url(#gradient)"
          strokeWidth="3"
        />
      </motion.svg>

      {showText && (

        <Box>

          <Typography
            variant="h4"
            fontWeight={800}
            color="white"
            letterSpacing={1}
            lineHeight={1}
          >
            SHDEP
          </Typography>

          <Typography
            fontSize={13}
            color="text.secondary"
            sx={{
              letterSpacing:1.4,
              textTransform:"uppercase",
            }}
          >
            Self-Healing Platform
          </Typography>

        </Box>

      )}
    </Box>
  );
}