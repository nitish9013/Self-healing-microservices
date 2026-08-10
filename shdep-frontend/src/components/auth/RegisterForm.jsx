import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
} from "@mui/material";

import {
  PersonRounded,
  BadgeRounded,
  AccountCircleRounded,
  EmailRounded,
  KeyRounded,
  LockRounded,
  Visibility,
  VisibilityOff,
  PersonAddRounded,
} from "@mui/icons-material";

export default function RegisterForm() {
    const navigate = useNavigate();

const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};
const handleRegister = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  // Basic Validation

  if (
    !formData.username ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    setError("Please fill all fields.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    await authService.register(payload);

    setSuccess("Registration successful!");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err) {
    setError(
      err.response?.data ||
      "Registration failed."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <Paper
      component={motion.div}
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.75,
        ease: "easeOut",
      }}
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 540,

        p: 5,

        borderRadius: 8,

        position: "relative",

        background: "rgba(18,28,48,.84)",

        backdropFilter: "blur(24px)",

        border: "1px solid rgba(255,255,255,.12)",

        boxShadow:
          "0 45px 110px rgba(0,0,0,.55)",

        overflow: "hidden",

        "&::before": {
          content: '""',

          position: "absolute",

          inset: 0,

          borderRadius: "inherit",

          background:
            "linear-gradient(135deg,rgba(59,130,246,.08),transparent 45%)",

          pointerEvents: "none",
        },
      }}
    >
        <form onSubmit={handleRegister}>
      {/* Lock Badge */}

      <motion.div
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.8,
          ease: "easeInOut",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,

            borderRadius: "50%",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background:
              "linear-gradient(135deg,#2563EB,#38BDF8)",

            boxShadow:
              "0 0 45px rgba(37,99,235,.55)",

            mb: 3,
          }}
        >
          <LockRounded
            sx={{
              fontSize: 32,
              color: "#fff",
            }}
          />
        </Box>
      </motion.div>

      {/* Header */}

      <Typography
        sx={{
          fontSize: 42,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: -1,
        }}
      >
        Create Account
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",

          mt: 1,

          mb: 4,

          lineHeight: 1.8,
        }}
      >
        Create your SHDEP account to start
        managing distributed microservices
        securely.
      </Typography>

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,.08)",

          mb: 4,
        }}
      />
      {error && (
  <Typography
    sx={{
      mb: 3,
      color: "#EF4444",
      fontWeight: 600,
      textAlign: "center",
    }}
  >
    {error}
  </Typography>
)}

{success && (
  <Typography
    sx={{
      mb: 3,
      color: "#22C55E",
      fontWeight: 600,
      textAlign: "center",
    }}
  >
    {success}
  </Typography>
)}

    

      {/* Username */}

      <Typography
        color="#CBD5E1"
        mb={1}
        fontWeight={600}
      >

        Username
      </Typography>

      <TextField
        fullWidth
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Choose a username"
        margin="none"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircleRounded
                sx={{
                  color: "#64748B",
                }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,

          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: 4,

            background:
              "rgba(255,255,255,.04)",

            transition:
              "all .28s ease",

            "& fieldset": {
              borderColor:
                "rgba(255,255,255,.08)",
            },

            "&:hover": {
              transform:
                "translateY(-1px)",
            },

            "&:hover fieldset": {
              borderColor: "#3B82F6",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#3B82F6",

              boxShadow:
                "0 0 0 4px rgba(59,130,246,.12)",
            },
          },

          "& input": {
            color: "#fff",
          },

          "& input::placeholder": {
            color: "#94A3B8",
            opacity: 1,
          },
        }}
      />

            {/* Email */}

      <Typography
        color="#CBD5E1"
        mb={1}
        fontWeight={600}
      >
        Email
      </Typography>

      <TextField
        fullWidth
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        placeholder="Enter your email"
        margin="none"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailRounded
                sx={{
                  color: "#64748B",
                }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,

          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: 4,
            background: "rgba(255,255,255,.04)",
            transition: "all .28s ease",

            "& fieldset": {
              borderColor: "rgba(255,255,255,.08)",
            },

            "&:hover": {
              transform: "translateY(-1px)",
            },

            "&:hover fieldset": {
              borderColor: "#3B82F6",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#3B82F6",
              boxShadow:
                "0 0 0 4px rgba(59,130,246,.12)",
            },
          },

          "& input": {
            color: "#fff",
          },

          "& input::placeholder": {
            color: "#94A3B8",
            opacity: 1,
          },
        }}
      />

      {/* Password */}

      <Typography
        color="#CBD5E1"
        mb={1}
        fontWeight={600}
      >
        Password
      </Typography>

      <TextField
        fullWidth
        name="password"
        value={formData.password}
        onChange={handleChange}
        type={showPassword ? "text" : "password"}
        placeholder="Create a password"
        margin="none"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <KeyRounded
                sx={{
                  color: "#64748B",
                }}
              />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                sx={{
                  color: "#94A3B8",

                  "&:hover": {
                    color: "#60A5FA",
                    background:
                      "rgba(59,130,246,.10)",
                  },
                }}
              >
                {showPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,

          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: 4,
            background: "rgba(255,255,255,.04)",
            transition: "all .28s ease",

            "& fieldset": {
              borderColor: "rgba(255,255,255,.08)",
            },

            "&:hover": {
              transform: "translateY(-1px)",
            },

            "&:hover fieldset": {
              borderColor: "#3B82F6",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#3B82F6",
              boxShadow:
                "0 0 0 4px rgba(59,130,246,.12)",
            },
          },

          "& input": {
            color: "#fff",
          },

          "& input::placeholder": {
            color: "#94A3B8",
            opacity: 1,
          },
        }}
      />

      {/* Confirm Password */}

      <Typography
        color="#CBD5E1"
        mb={1}
        fontWeight={600}
      >
        Confirm Password
      </Typography>

      <TextField
        fullWidth
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        type={
          showConfirmPassword
          
            ? "text"
            : "password"
        }
        
        placeholder="Confirm your password"
        margin="none"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockRounded
                sx={{
                  color: "#64748B",
                }}
              />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                sx={{
                  color: "#94A3B8",

                  "&:hover": {
                    color: "#60A5FA",
                    background:
                      "rgba(59,130,246,.10)",
                  },
                }}
              >
                {showConfirmPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: 4,
            background: "rgba(255,255,255,.04)",
            transition: "all .28s ease",

            "& fieldset": {
              borderColor: "rgba(255,255,255,.08)",
            },

            "&:hover": {
              transform: "translateY(-1px)",
            },

            "&:hover fieldset": {
              borderColor: "#3B82F6",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#3B82F6",
              boxShadow:
                "0 0 0 4px rgba(59,130,246,.12)",
            },
          },

          "& input": {
            color: "#fff",
          },

          "& input::placeholder": {
            color: "#94A3B8",
            opacity: 1,
          },
        }}
      />

      {/* Terms */}

      <FormControlLabel
        sx={{ mt: 2 }}
        control={
          <Checkbox
            sx={{
              color: "#64748B",

              "&.Mui-checked": {
                color: "#3B82F6",
              },
            }}
          />
        }
        label={
          <Typography
            fontSize={14}
            color="#CBD5E1"
          >
            I agree to{" "}
            <Link
              href="#"
              color="#60A5FA"
              underline="hover"
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              href="#"
              color="#60A5FA"
              underline="hover"
            >
              Privacy Policy
            </Link>
          </Typography>
        }
      />

      {/* Create Account */}

      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          disabled={loading}
          fullWidth
          variant="contained"
          startIcon={<PersonAddRounded />}
          sx={{
            mt: 4,
            height: 60,

            borderRadius: 4,

            fontSize: 17,

            fontWeight: 700,

            textTransform: "none",

            background:
              "linear-gradient(90deg,#2563EB,#0EA5E9)",

            "&:hover": {
              transform:
                "translateY(-3px)",

              background:
                "linear-gradient(90deg,#1D4ED8,#0284C7)",

              boxShadow:
                "0 24px 60px rgba(37,99,235,.45)",
            },
          }}
        >
         {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </motion.div>

      <Divider
        sx={{
          my: 4,
          borderColor:
            "rgba(255,255,255,.08)",
        }}
      >
        <Typography
          fontSize={12}
          color="#64748B"
        >
          OR
        </Typography>
      </Divider>

      {/* Footer */}

      <Typography
        textAlign="center"
        color="#94A3B8"
      >
        Already have an account?{" "}
      <Link
  component={RouterLink}
  to="/login"
  underline="hover"
  color="#60A5FA"
  fontWeight={700}
>
 
  Sign In →
</Link>
      </Typography>

       </form>
    </Paper>
  );
}