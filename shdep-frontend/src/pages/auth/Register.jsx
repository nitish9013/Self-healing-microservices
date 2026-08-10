import { Box } from "@mui/material";

import BackgroundGlow from "../../components/common/BackgroundGlow";
import BrandingPanel from "../../components/auth/BrandingPanel";
import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
  return (
    <>
      <BackgroundGlow />

      <Box
        sx={{
          minHeight: "100vh",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          px: 4,

          position: "relative",

          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",

            maxWidth: 1450,

            display: "flex",

            borderRadius: 8,

            overflow: "hidden",

            backdropFilter: "blur(30px)",

            background: "rgba(15,23,42,.30)",

            border:
              "1px solid rgba(255,255,255,.08)",

            boxShadow:
              "0 40px 120px rgba(0,0,0,.45)",
          }}
        >
          {/* Left */}

          <Box
            sx={{
              flex: 0.42,

              p: 7,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              borderRight:
                "1px solid rgba(255,255,255,.08)",
            }}
          >
            <BrandingPanel />
          </Box>

          {/* Right */}

          <Box
            sx={{
              flex: 0.58,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              p: 7,
            }}
          >
            <RegisterForm />
          </Box>
        </Box>
      </Box>
    </>
  );
}