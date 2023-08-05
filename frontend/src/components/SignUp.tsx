import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Link
} from "@mui/material";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { auth } from "../utils/firebase";
import Alert from "./Alert";
import generalStyles from "../styling/generalpage.module.css";

type SignUpProps = {
  setPage: Dispatch<SetStateAction<LoginPage>>;
};

function SignUp({ setPage }: SignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState<string>("");
  const [alerts, setAlerts] = useState<Array<AlertMessage>>([]);
  const [hasTypedFirstName, setHasTypedFirstName] = useState<boolean>(false);
  const [hasTypedLastName, setHasTypedLastName] = useState<boolean>(false);
  const [hasTypedEmail, setHasTypedEmail] = useState<boolean>(false);
  const [hasTypedPassword, setHasTypedPassword] = useState<boolean>(false);
  const [hasTypedPasswordConf, setHasTypedPasswordConf] =
    useState<boolean>(false);
  const reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const createAccount = async () => {
    setError("");
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(user, { displayName: `${firstName} ${lastName}` });
      await sendEmailVerification(user);
      auth.signOut();
      const newAlert: AlertMessage = {
        severity: "success",
        message:
          "Registered successfully! Please make sure to check your email or your spam folder for an email verification link.",
        isDeletion: false
      };
      setAlerts([...alerts, newAlert]);
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPasswordConf("");
      setTermsChecked(false);
      setHasTypedFirstName(false);
      setHasTypedLastName(false);
      setHasTypedEmail(false);
      setHasTypedPassword(false);
      setHasTypedPasswordConf(false);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else if (error.code === "auth/invalid-email") {
        setError("Your email is invalid.");
      } else if (error.code === "auth/weak-password") {
        setError("Your password is too weak. Minimum 6 characters.");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box className={generalStyles.box}>
        <Image
          src="/static/AICS-logo.png"
          alt="AICS Logo"
          width="150"
          height="150"
        />
        <br />
        <Typography component="h1" variant="h5">
          AICS Parent Portal Sign Up
        </Typography>
        <br />
        {alerts.map((alert: AlertMessage, i) => (
          <Alert key={i} alert={alert} setAlerts={setAlerts} />
        ))}
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <div className={generalStyles.generalldiv}>
            {error && <Typography color="error">{error}</Typography>}
          </div>
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            name="firstname"
            autoComplete="firstname"
            autoFocus
            value={firstName}
            error={hasTypedFirstName && firstName === ""}
            helperText={
              firstName === "" && hasTypedFirstName
                ? "Please enter a first name."
                : ""
            }
            onChange={(e) => {
              setFirstName(e.target.value);
              setHasTypedFirstName(true);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="lastname"
            autoComplete="lastname"
            value={lastName}
            error={hasTypedLastName && lastName === ""}
            helperText={
              lastName === "" && hasTypedLastName
                ? "Please enter a last name."
                : ""
            }
            onChange={(e) => {
              setLastName(e.target.value);
              setHasTypedLastName(true);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            error={hasTypedEmail && (email === "" || !reg.test(email))}
            helperText={
              hasTypedEmail && email === ""
                ? "Please enter a valid email address."
                : hasTypedEmail && !reg.test(email)
                ? "Please enter a valid email address."
                : ""
            }
            onChange={(e) => {
              setEmail(e.target.value);
              setHasTypedEmail(true);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            error={hasTypedPassword && password.length < 6}
            helperText={
              password.length < 6 && hasTypedPassword
                ? "Please enter password longer than 6 characters."
                : ""
            }
            onChange={(e) => {
              setPassword(e.target.value);
              setHasTypedPassword(true);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Confirm Password"
            type="password"
            autoComplete="new-password-conf"
            value={passwordConf}
            error={hasTypedPasswordConf && passwordConf !== password}
            helperText={
              hasTypedPasswordConf && passwordConf !== password
                ? "Passwords do not match."
                : ""
            }
            onChange={(e) => {
              setPasswordConf(e.target.value);
              setHasTypedPasswordConf(true);
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                value="agree"
                color="primary"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                sx={{
                  color: "white",
                  "&.Mui-checked": {
                    color: "white"
                  }
                }}
              />
            }
            label="I agree to the Terms and Conditions and Privacy Policy.*"
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={
              !termsChecked ||
              !email ||
              !password ||
              !firstName ||
              !lastName ||
              password !== passwordConf
            }
            onClick={createAccount}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link
                variant="body2"
                onClick={() => {
                  setPage("signIn");
                  setError("");
                }}
              >
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;
