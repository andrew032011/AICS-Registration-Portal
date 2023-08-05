import API from "../../api/API";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  StyledEngineProvider,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase";
import Alert from "../../components/Alert";
import { deleteUser } from "firebase/auth";
import generalStyles from "../../styling/generalpage.module.css";
import profile from "../../styling/profile.module.css";

const ProfileView = () => {
  const [alerts, setAlerts] = useState<Array<AlertMessage>>([]);

  const [userAttributes, setUserAttributes] = useState<UserAttributes>({
    firstName: "",
    lastName: "",
    email: "",
    roles: []
  });

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openedConfirmationDialog, setOpenedConfirmationDialog] =
    useState<boolean>(false);

  useEffect(() => {
    API.getMyUserAttributes().then((userAttributes) => {
      setUserAttributes(userAttributes);
      setFirstName(userAttributes.firstName);
      setLastName(userAttributes.lastName);
      setIsLoading(false);
    });
  }, []);

  const handleSaveChanges = () => {
    API.updateMyUserAttributes({
      ...userAttributes,
      firstName: firstName,
      lastName: lastName
    }).then((newUserAttributes) => {
      const newAlert: AlertMessage = {
        severity: "success",
        message: "Saved successfully!",
        isDeletion: false
      };
      setAlerts([...alerts, newAlert]);
      setUserAttributes(newUserAttributes);
    });
  };

  return (
    <div className={profile.maindiv}>
      <h1>Profile</h1>

      {alerts.map((alert: AlertMessage, i) => (
        <Alert key={i} alert={alert} setAlerts={setAlerts} />
      ))}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <StyledEngineProvider injectFirst>
          <div>
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
            <br />
            <Button
              variant="contained"
              disabled={
                (userAttributes.firstName === firstName &&
                  userAttributes.lastName === lastName) ||
                firstName === "" ||
                lastName === ""
              }
              sx={{ width: "200px", marginTop: "10%" }}
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
            <br />
            <Button
              className={generalStyles.deleteButton}
              variant="contained"
              color="error"
              sx={{ width: "200px", marginTop: "10%" }}
              onClick={() => setOpenedConfirmationDialog(true)}
            >
              Delete Account/
              <br />
              Revoke Consent
            </Button>

            <Dialog
              open={openedConfirmationDialog}
              onClose={() => setOpenedConfirmationDialog(false)}
            >
              <DialogTitle>
                {`Are you sure you want to delete your account? Note that revoking your consent to the Terms and Conditions and Privacy Policy will lead to your account being deleted as well. This cannot be undone.`}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please confirm that you want to remove your account. This will
                  also both delete and unenroll all children who are registered
                  under your account.
                  <br />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenedConfirmationDialog(false)}>
                  CANCEL
                </Button>
                <Button
                  onClick={() => {
                    API.deleteUser().then(async () => {
                      if (auth.currentUser !== null) {
                        await deleteUser(auth.currentUser);
                      }
                      auth.signOut();
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
      )}
    </div>
  );
};

export default ProfileView;
