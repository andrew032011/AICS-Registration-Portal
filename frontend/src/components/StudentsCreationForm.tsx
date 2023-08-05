import API from "../api/API";
import { Autocomplete, Button, Radio, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Alert from "./Alert";
import creationform from "../styling/mystudentscreationform.module.css";

type StudentsFormProps = {
  setAllParents: Dispatch<SetStateAction<Array<User>>>;
  parents: User[];
};

const StudentsCreationForm = ({
  setAllParents,
  parents
}: StudentsFormProps) => {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [selectedParent, setSelectedParent] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Array<AlertMessage>>([]);
  const [hasTypedFirstName, setHasTypedFirstName] = useState<boolean>(false);
  const [hasTypedLastName, setHasTypedLastName] = useState<boolean>(false);
  const [hasTypedEmail, setHasTypedEmail] = useState<boolean>(false);
  const [hasSelectedParent, setHasSelectedParent] = useState<boolean>(false);
  const invalidPunctuation = ["=", "&", "_", "'", "-", "+", ",", "<", ">"];
  const regex = /\.{2,}/; // Regular expression to match two or more consecutive periods
  const emailIsDisabled = () =>
    !email.toLowerCase().endsWith("@gmail.com") ||
    invalidPunctuation.some((character) => email.indexOf(character) !== -1) ||
    regex.test(email);
  const isDisabled = () =>
    firstName === "" ||
    lastName === "" ||
    email === "" ||
    selectedParent === null ||
    emailIsDisabled();

  const addStudents = () => {
    API.addStudent(
      {
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        uuid: ""
      },
      selectedParent?.email
    ).then((response) => {
      const newAlert: AlertMessage = {
        severity: "success",
        message: "Student successfully added!",
        isDeletion: false
      };
      setAlerts([...alerts, newAlert]);
      setAllParents((parents) =>
        parents.map((parent) => {
          if (parent.email === selectedParent?.email) {
            return { ...parent, students: [...parent.students, response] };
          } else {
            return parent;
          }
        })
      );
      setFirstName("");
      setLastName("");
      setEmail("");
      setSelectedParent(null);
      setHasTypedFirstName(false);
      setHasTypedLastName(false);
      setHasTypedEmail(false);
      setHasSelectedParent(false);
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
      <p>Parent:</p>
      <Autocomplete
        sx={{ width: 300 }}
        options={parents}
        getOptionLabel={(option) =>
          `${option.firstName} ${option.lastName} (${option.email})`
        }
        isOptionEqualToValue={(option, value) =>
          option.firstName === value.firstName
        }
        noOptionsText={"No parents registered!"}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Radio style={{ marginRight: 8 }} checked={selected} />
            {`${option.firstName} ${option.lastName} (${option.email})`}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Parent"
            placeholder="Parent"
            error={hasSelectedParent && selectedParent === undefined}
            helperText={
              selectedParent === undefined && hasSelectedParent
                ? "Please select a parent."
                : ""
            }
          />
        )}
        value={selectedParent}
        onChange={(_, newSelectedParent) => {
          setSelectedParent(newSelectedParent || null);
          setHasSelectedParent(true);
        }}
      />

      <Button
        variant="contained"
        sx={{ width: "200px", marginTop: "20px" }}
        disabled={isDisabled()}
        onClick={addStudents}
      >
        Add Student
      </Button>
    </div>
  );
};

export default StudentsCreationForm;
