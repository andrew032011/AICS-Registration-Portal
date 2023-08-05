import React, { useState } from "react";
import { Button, StyledEngineProvider } from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Image from "next/image";
import CopyRightTag from "./CopyRightTag";
import SignUp from "./SignUp";
import PasswordReset from "./PasswordReset";
import signin from "../styling/signin.module.css";
import generalStyles from "../styling/generalpage.module.css";

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      className={signin.typography}
      marginBottom={"50px"}
    >
      <br />
      <div className={signin.textdiv}>
        By creating an account, you agree to the&nbsp;
        <a
          className={signin.termsandconditions}
          href="https://www.actoninstituteofcs.org/terms-and-conditions"
          target="_blank"
        >
          Terms and Conditions
        </a>{" "}
        &nbsp;and the&nbsp;
        <a
          className={signin.termsandconditions}
          href="https://www.actoninstituteofcs.org/privacy-policy"
          target="_blank"
        >
          {" "}
          Privacy Policy
        </a>
        .
      </div>
      <br />
      <CopyRightTag />
    </Typography>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<LoginPage>("signIn");

  const handleSignIn = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Scroll user to top of page upon successful login
      window.scrollTo(window.scrollX, 0);
    } catch (error: any) {
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Your email or password was incorrect.");
      } else if (error.code === "auth/user-not-found") {
        setError("No user was found with the email address you entered.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
    if (auth.currentUser?.emailVerified === false) {
      setError("Please make sure to verify your email.");
      auth.signOut();
    }
    setEmail("");
    setPassword("");
  };
  const onGoogleSignIn = () => {
    signInWithPopup(auth, provider).catch(() => {
      /* pop-up cancelled */
    });
  };

  return (
    <StyledEngineProvider injectFirst>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {page === "signUp" ? (
          <SignUp setPage={setPage} />
        ) : page === "passwordReset" ? (
          <PasswordReset setPage={setPage} />
        ) : (
          <Box className={generalStyles.box}>
            <Image
              src="/static/AICS-logo.png"
              alt="AICS Logo"
              width="150"
              height="150"
            />
            <br />
            <Typography component="h1" variant="h5">
              AICS Parent Portal
            </Typography>
            <br />
            <div>
              <Button
                className={signin.signIn}
                onClick={onGoogleSignIn}
                variant="outlined"
                size="large"
                color="inherit"
              >
                <Image
                  src="/static/google-logo.png"
                  alt="Google Logo"
                  width="30"
                  height="30"
                  className={signin.image}
                />{" "}
                Sign in with Google
              </Button>
            </div>
            <br />
            <Typography variant="body2" align="center">
              <h2>OR</h2>
            </Typography>
            <hr className={signin.hr} />
            <h4>Sign in here:</h4>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              <div className={signin.signinbox}>
                {error && <Typography color="error">{error}</Typography>}
              </div>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!email || !password}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    variant="body2"
                    onClick={() => {
                      setPage("passwordReset");
                      setError("");
                    }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    variant="body2"
                    onClick={() => {
                      setPage("signUp");
                      setError("");
                    }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        <Copyright />
      </Container>
    </StyledEngineProvider>
  );
}

export default SignIn;
