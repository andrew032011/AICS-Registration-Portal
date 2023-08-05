import React, { Dispatch, SetStateAction, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link, TextField, Button, Typography } from "@mui/material";
import { auth } from "../utils/firebase";
import passwordreset from "../styling/passwordreset.module.css";

type PasswordResetProps = {
  setPage: Dispatch<SetStateAction<LoginPage>>;
};

function PasswordReset({ setPage }: PasswordResetProps) {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string>("");

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        setError("Your email is invalid.");
      } else if (error.code === "auth/user-not-found") {
        setError("This account was not found.");
      }
    }
  };

  if (isEmailSent) {
    return (
      <div>
        <h2>Password Reset Email Sent</h2>
        <p>
          An email has been sent to your email address with instructions on how
          to reset your password. It may take a few minutes to process.
        </p>
        <p>
          Please check your inbox and follow the provided link to reset your
          password.
        </p>
        <p>
          <Link
            variant="body2"
            onClick={() => {
              setPage("signIn");
              setError("");
            }}
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Password Reset</h2>
      <form>
        <div className={passwordreset.maindiv}>
          {error && <Typography color="error">{error}</Typography>}
        </div>
        <br />
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          disabled={!email}
          onClick={handlePasswordReset}
        >
          Reset Password
        </Button>
      </form>
      <p>
        <Link variant="body2" onClick={() => setPage("signIn")}>
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}

export default PasswordReset;
