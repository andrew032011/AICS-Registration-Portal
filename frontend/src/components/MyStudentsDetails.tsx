import API from "../api/API";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  StyledEngineProvider,
  TextField
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import generalStyles from "../styling/generalpage.module.css";
import mystudentsdetails from "../styling/mystudentsdetails.module.css";

type MyStudentsDetailsProps = {
  student: Student;
  setMyStudents: Dispatch<SetStateAction<Array<Student>>>;
  setAlerts: Dispatch<SetStateAction<Array<AlertMessage>>>;
  alerts: Array<AlertMessage>;
  allClassesInfo: Array<AicsClassInfo>;
};

const MyStudentsDetails = ({
  student,
  setMyStudents,
  setAlerts,
  alerts,
  allClassesInfo
}: MyStudentsDetailsProps) => {
  const [openedConfirmationDialog, setOpenedConfirmationDialog] =
    useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>(student.firstName);
  const [lastName, setLastName] = useState<string>(student.lastName);
  const [email, setEmail] = useState<string>(student.email);
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);

  const haveTextFieldsChanged = () =>
    firstName !== student.firstName ||
    lastName !== student.lastName ||
    email !== student.email;

  const classesRegistered = allClassesInfo.filter((classInfo) =>
    classInfo.studentUuids.includes(student.uuid)
  );

  return (
    <StyledEngineProvider injectFirst>
      <div className={mystudentsdetails.maindiv}>
        {isEditEnabled ? (
          <li>
            <p>First Name:</p>
            <TextField
              error={firstName === ""}
              helperText={firstName === "" ? "Please enter a first name." : ""}
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <p>Last Name:</p>
            <TextField
              error={lastName === ""}
              helperText={lastName === "" ? "Please enter a last name." : ""}
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <p>Email (Gmail only):</p>
            <TextField
              error={
                email === "" || !email.toLowerCase().endsWith("@gmail.com")
              }
              helperText={
                email === ""
                  ? "Please enter an email."
                  : !email.toLowerCase().endsWith("@gmail.com")
                  ? "Please enter a gmail address (ends in @gmail.com)."
                  : ""
              }
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </li>
        ) : (
          <li>
            {`${student.firstName} ${student.lastName} (${student.email})`}
            {classesRegistered.length > 0 && <p>Classes Registered:</p>}
            <ul>
              {classesRegistered.map((curClass: AicsClassInfo, i) => (
                <li key={i}>{`${curClass.name} (${curClass.time})`}</li>
              ))}
            </ul>
          </li>
        )}

        {isEditEnabled ? (
          <Button
            className={mystudentsdetails.editbutton}
            variant="contained"
            onClick={() => {
              if (haveTextFieldsChanged()) {
                API.updateStudent({
                  ...student,
                  firstName: firstName,
                  lastName: lastName,
                  email: email
                }).then((updatedStudent) => {
                  setMyStudents((students) =>
                    students.map((currStudent) =>
                      student === currStudent ? updatedStudent : currStudent
                    )
                  );
                  setAlerts([
                    ...alerts,
                    {
                      severity: "success",
                      message: "Saved successfully!",
                      isDeletion: false
                    }
                  ]);
                  setIsEditEnabled(false);
                });
              } else {
                setIsEditEnabled(false);
              }
            }}
            disabled={
              firstName === "" ||
              lastName === "" ||
              email === "" ||
              !email.toLowerCase().endsWith("@gmail.com")
            }
          >
            {!haveTextFieldsChanged() ? "Cancel" : "Save"}
          </Button>
        ) : (
          <Button
            variant="contained"
            className={mystudentsdetails.editbutton}
            onClick={() => setIsEditEnabled(true)}
          >
            Edit
          </Button>
        )}
        <Button
          variant="contained"
          color="error"
          className={generalStyles.deleteButton}
          sx={{ marginBottom: "16px" }}
          onClick={() => {
            setOpenedConfirmationDialog(true);
          }}
        >
          Delete Child
        </Button>

        <Dialog
          open={openedConfirmationDialog}
          onClose={() => setOpenedConfirmationDialog(false)}
        >
          <DialogTitle>
            {`Are you sure you want to delete "${student.firstName} ${student.lastName}"?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please confirm that you want to remove {student.firstName}{" "}
              {student.lastName}.<br />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              className={generalStyles.cancelProceedButton}
              onClick={() => setOpenedConfirmationDialog(false)}
            >
              CANCEL
            </Button>
            <Button
              className={generalStyles.cancelProceedButton}
              onClick={() => {
                API.deleteStudent(student.uuid).then(() => {
                  const newAlert: AlertMessage = {
                    severity: "success",
                    message: `${student.firstName} ${student.lastName} has been successfully deleted!`,
                    isDeletion: true
                  };
                  setAlerts([...alerts, newAlert]);
                  setMyStudents((myStudents) =>
                    myStudents.filter((curStudent) => curStudent !== student)
                  );
                });
                setOpenedConfirmationDialog(false);
              }}
            >
              PROCEED
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </StyledEngineProvider>
  );
};

export default MyStudentsDetails;
