import API from "../api/API";
import { Button, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Alert from "./Alert";
import creationform from "../styling/mystudentscreationform.module.css";

type MyStudentsFormProps = {
  setMyStudents: Dispatch<SetStateAction<Array<Student>>>;
};

const MyStudentsCreationForm = ({ setMyStudents }: MyStudentsFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [alerts, setAlerts] = useState<Array<AlertMessage>>([]);
  const [hasTypedFirstName, setHasTypedFirstName] = useState<boolean>(false);
  const [hasTypedLastName, setHasTypedLastName] = useState<boolean>(false);
  const [hasTypedEmail, setHasTypedEmail] = useState<boolean>(false);
  const invalidPunctuation = ["=", "&", "_", "'", "-", "+", ",", "<", ">"];
  const regex = /\.{2,}/; // Regular expression to match two or more consecutive periods
  const emailIsDisabled = () =>
    !email.toLowerCase().endsWith("@gmail.com") ||
    invalidPunctuation.some((character) => email.indexOf(character) !== -1) ||
    regex.test(email);
  const isDisabled = () =>
    firstName === "" || lastName === "" || email === "" || emailIsDisabled();

  const addStudents = () => {
    API.addStudent({
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      uuid: ""
    }).then((response) => {
      const newAlert: AlertMessage = {
        severity: "success",
        message: "Child successfully added!",
        isDeletion: false
      };
      setAlerts([...alerts, newAlert]);
      setMyStudents((myStudents) => [...myStudents, response]);
      setFirstName("");
      setLastName("");
      setEmail("");
      setHasTypedFirstName(false);
      setHasTypedLastName(false);
      setHasTypedEmail(false);
    });
  };

  return (
    <div className={creationform.maindiv}>
      <h2>Add Child</h2>
      {alerts.map((alert: AlertMessage, i) => (
        <Alert key={i} alert={alert} setAlerts={setAlerts} />
      ))}

      <p>First Name:</p>
      <TextField
        label="First Name"
        error={hasTypedFirstName && firstName === ""}
        helperText={
          firstName === "" && hasTypedFirstName
            ? "Please enter a first name."
            : ""
        }
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
          setHasTypedFirstName(true);
        }}
      />
      <p>Last Name:</p>
      <TextField
        label="Last Name"
        error={hasTypedLastName && lastName === ""}
        helperText={
          lastName === "" && hasTypedLastName ? "Please enter a last name." : ""
        }
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
          setHasTypedLastName(true);
        }}
      />
      <p>Email (Gmail only):</p>
      <TextField
        label="Email"
        error={hasTypedEmail && emailIsDisabled()}
        helperText={
          hasTypedEmail &&
          (email === "" || !email.toLowerCase().endsWith("@gmail.com"))
            ? "Please enter a valid email ending with @gmail.com"
            : invalidPunctuation.some(
                (character) => email.indexOf(character) !== -1
              ) || regex.test(email)
            ? "Email contains invalid characters."
            : ""
        }
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setHasTypedEmail(true);
        }}
      />

      <Button
        variant="contained"
        sx={{ width: "200px", marginTop: "20px" }}
        disabled={isDisabled()}
        onClick={addStudents}
      >
        Add Child
      </Button>
    </div>
  );
};

export default MyStudentsCreationForm;
