import { useState } from "react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  Visibility,
  VisibilityOff,
  LoginRounded,
  LockRounded,
  PersonRounded,
  KeyRounded,
} from "@mui/icons-material";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
});

const [loading, setLoading] = useState(false);

const [error, setError] = useState("");

const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {

    setFormData({

        ...formData,

        [e.target.name]: e.target.value,

    });

};
const handleLogin = async (e) => {

    e.preventDefault();


    console.log("LOGIN BUTTON CLICKED");
    console.log("FORM DATA =", formData);

    setError("");

    setSuccess("");

    if (
        !formData.username ||
        !formData.password
    ) {

        setError("Please fill all fields.");
    
        return;

    }
    

    try {

        setLoading(true);

       const response = await authService.login({
    username: formData.username,
    password: formData.password,
});

console.log("JWT =", response.token);
console.log("LOGIN RESPONSE =", response);
console.log("USER ID =", response.userId);

// Save JWT
login(
    response.token,
    
    response.userId
);

setSuccess("Login successful!");

setTimeout(() => {
    navigate("/dashboard");
}, 1000);

    }

    catch (err) {

        setError(

            err.response?.data ||

            "Invalid username or password."

        );

    }

    finally {

        setLoading(false);

    }

};
{error && (
    <Typography
        sx={{
            color:"#EF4444",
            mb:3,
            textAlign:"center",
            fontWeight:600
        }}
    >
        {error}
    </Typography>
)}

{success && (
    <Typography
        sx={{
            color:"#22C55E",
            mb:3,
            textAlign:"center",
            fontWeight:600
        }}
    >
        {success}
    </Typography>
)}

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
  duration: .75,
  ease: "easeOut",
}}
      elevation={0}
      sx={{
        position: "relative",

"&::before": {
  content: '""',

  position: "absolute",

  inset: 0,

  borderRadius: "inherit",

  background:
    "linear-gradient(135deg,rgba(59,130,246,.08),transparent 45%)",

  pointerEvents: "none",
},
        width: "100%",
        maxWidth: 520,

        p: 5,

        borderRadius: 8,

        background: "rgba(18,28,48,.84)",

        backdropFilter: "blur(24px)",

        border: "1px solid rgba(255,255,255,.12)",

        boxShadow:
"0 0 45px rgba(37,99,235,.55)",

        overflow: "hidden",
      }}
    >
    <form onSubmit={handleLogin}>

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
        <LockRounded
          sx={{
            fontSize: 30,
            color: "#fff",
          }}
        />
     </motion.div>

      {/* Header */}

      <Typography
    component="h1"
    sx={{
        fontSize: 42,
        fontWeight: 800,
        color: "white",
    }}
>
    Welcome Back
</Typography>

     <Typography
    component="p"
    sx={{
        color: "#798fad",
        mt: 1,
        mb: 6,
        lineHeight: 1.95,
        fontSize: 16,
    }}
>
    Securely sign in to access your enterprise workspace.
</Typography>

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,.08)",

          mb: 4,
        }}
      />

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
        placeholder="Enter your username"
        variant="outlined"
        margin="none"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonRounded
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

            borderRadius: 3,

            background:
              "rgba(255,255,255,.04)",

            transition: "all .2.8 ease",
           
            "&:hover": {
           transform: "translateY(-1px)",
           },
          
            "& fieldset": {
              borderColor:
                "rgba(255,255,255,.08)",
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
        placeholder="Enter your password"
        type={showPassword ? "text" : "password"}
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
                edge="end"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                sx={{
                  color: "#94A3B8",

                  transition: "all ..28s ease",

                  "&:hover": {
                  transform: "translateY(-1px)",
                    },
                 
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
          "& .MuiOutlinedInput-root": {
            height: 56,

            borderRadius: 3,

            background:
              "rgba(255,255,255,.04)",

            transition: ".25s",

            "& fieldset": {
              borderColor:
                "rgba(255,255,255,.08)",
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

      {/* Remember Me */}

      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <FormControlLabel
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
              color="#CBD5E1"
              fontSize={14}
            >
              Keep me signed in
            </Typography>
          }
        />

        <Link
          href="#"
          underline="hover"
          color="#60A5FA"
          fontWeight={600}
        >
          Forgot Password?
        </Link>
      </Box>

      {/* Sign In */}

      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          disabled={loading}
          fullWidth
          variant="contained"
          startIcon={<LoginRounded />}
          sx={{
            mt: 4,

            height: 58,

            borderRadius: 3,

            fontSize: 17,

            fontWeight: 700,

            textTransform: "none",

            background:
              "linear-gradient(90deg,#2563EB,#0EA5E9)",

            transition: ".25s",

            "&:hover": {

  transform:
    "translateY(-3px) scale(1.01)",

  background:
    "linear-gradient(90deg,#1D4ED8,#0284C7)",

  boxShadow:
    "0 24px 60px rgba(37,99,235,.45)",
},
          }}
        >
        {loading ? "Signing In..." : "Sign In"}
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
        Don't have an account?{" "}
        <Link
  component={RouterLink}
  to="/register"
  underline="hover"
  color="#60A5FA"
  fontWeight={700}
>
  Create one →
</Link>
      </Typography>
      </form>
    </Paper>
  );
}