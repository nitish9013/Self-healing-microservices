import { Box } from "@mui/material";

import BackgroundGlow from "../../components/common/BackgroundGlow";
import BrandingPanel from "../../components/auth/BrandingPanel";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <>
      <BackgroundGlow />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          p: { xs: 2, md: 4 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Master Container */}

        <Box
          sx={{
            width: "100%",
            maxWidth: 1450,

            minHeight: {
              xs: "auto",
              lg: 820,
            },

            display: "flex",

            flexDirection: {
              xs: "column",
              lg: "row",
            },

            borderRadius: "34px",

            overflow: "hidden",

            position: "relative",

            background: "rgba(10,18,32,.62)",

            backdropFilter: "blur(28px)",

            border: "1px solid rgba(255,255,255,.08)",

            boxShadow:
              "0 35px 90px rgba(0,0,0,.45)",
          }}
        >
          {/* LEFT */}

          <Box
            sx={{
              pt: 6,
              flex: "0 0 42%",

              position: "relative",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              px: {
                xs: 4,
                md: 6,
              },

              py: {
                xs: 5,
                lg: 7,
              },
            }}
          >
            <BrandingPanel />
          </Box>

          {/* Divider */}

          <Box
            sx={{
              display: {
                xs: "none",
                lg: "block",
              },

              width: "1px",

              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,.12), transparent)",
            }}
          />

          {/* RIGHT */}

          <Box
            sx={{
              flex: 1,

              position: "relative",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              px: {
                xs: 4,
                md: 8,
              },

              py: {
                xs: 5,
                lg: 7,
              },
            }}
          >
            {/* Background Glow */}

            <Box
              sx={{
                position: "absolute",

                width: 520,
                height: 520,

                borderRadius: "50%",

                background:
                  "radial-gradient(circle, rgba(37,99,235,.20) 0%, transparent 72%)",

                filter: "blur(50px)",

                zIndex: 0,
              }}
            />

            {/* Login */}

            <Box
              sx={{
                pt: 6,
                position: "relative",

                zIndex: 2,

                width: "100%",

                display: "flex",

                justifyContent: "center",
              }}
            >
              <LoginForm />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}