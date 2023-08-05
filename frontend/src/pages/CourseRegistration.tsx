import React, { Dispatch, SetStateAction } from "react";

import API from "../api/API";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Checkbox,
  TextField,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  StyledEngineProvider
} from "@mui/material";
import { useEffect, useState } from "react";
import Alert from "../components/Alert";
import MUIAlert from "@mui/material/Alert";
import courseregistration from "../styling/courseregistration.module.css";
import generalStyles from "../styling/generalpage.module.css";

type CourseDetailsProps = {
  aicsClassInfo: AicsClassInfo;
  setAicsClassesInfo: Dispatch<SetStateAction<AicsClassInfo[]>>;
  myStudents: Student[];
};

const CourseDetails: React.FC<CourseDetailsProps> = ({
  aicsClassInfo,
  setAicsClassesInfo,
  myStudents
}) => {
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [alerts, setAlerts] = useState<Array<AlertMessage>>([]);

  const [
    openedUnenrollConfirmationDialog,
    setOpenedUnenrollConfirmationDialog
  ] = useState<string | null>(null);

  const isRegistrationAvailable = () =>
    aicsClassInfo.registrationOpen &&
    aicsClassInfo.studentUuids.length < aicsClassInfo.enrollmentLimit;

  const handleRegister = () => {
    const selectedStudentsUuids = selectedStudents.map(
      (student) => student.uuid
    );

    API.registerStudentsForClass(
      selectedStudentsUuids,
      aicsClassInfo.uuid
    ).then(() => {
      const updatedAicsClassInfo = {
        ...aicsClassInfo,
        studentUuids: aicsClassInfo.studentUuids.concat(selectedStudentsUuids)
      };

      setAicsClassesInfo((prevAicsClasses) =>
        prevAicsClasses.map((prevAicsClassInfo) =>
          prevAicsClassInfo.uuid === updatedAicsClassInfo.uuid
            ? updatedAicsClassInfo
            : prevAicsClassInfo
        )
      );

      const newAlert: AlertMessage = {
        severity: "success",
        message: `${
          selectedStudents.length === 1 ? "Child" : "Children"
        } registered sucessfully!`,
        isDeletion: false
      };
      setAlerts([...alerts, newAlert]);

      setSelectedStudents([]);
    });
  };

  const RegisteredStudentList = () => {
    const registeredStudents = myStudents.filter((student) =>
      aicsClassInfo.studentUuids.includes(student.uuid)
    );
    const numOtherStudents =
      aicsClassInfo.studentUuids.length - registeredStudents.length;

    return registeredStudents.length > 0 ? (
      <div>
        <h3>Children already registered:</h3>
        <ol>
          {registeredStudents.map((student) => (
            <li key={student.uuid}>
              <div className={courseregistration.studentlistdiv}>
                <div>
                  {`${student.firstName} ${student.lastName}`}
                  <br />
                  {`(${student.email})`}
                </div>
                <Button
                  variant="contained"
                  className={courseregistration.dialog}
                  onClick={() => {
                    setOpenedUnenrollConfirmationDialog(student.uuid);
                  }}
                >
                  Unenroll
                </Button>
              </div>
              <Dialog
                open={openedUnenrollConfirmationDialog === student.uuid}
                onClose={() => setOpenedUnenrollConfirmationDialog(null)}
              >
                <DialogTitle>
                  {`Are you sure you want to unenroll ${student.firstName} ${student.lastName} from ${aicsClassInfo.name} (${aicsClassInfo.time})?`}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please confirm that you want to unenroll {student.firstName}{" "}
                    {student.lastName} from {aicsClassInfo.name} (
                    {aicsClassInfo.time}).
                    <br />
                    WARNING: If you unenroll {student.firstName}{" "}
                    {student.lastName} from {aicsClassInfo.name} (
                    {aicsClassInfo.time}), you will have to register again.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setOpenedUnenrollConfirmationDialog(null)}
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={() => {
                      API.removeStudentFromClass(
                        aicsClassInfo.uuid,
                        student.uuid
                      ).then(() => {
                        setOpenedUnenrollConfirmationDialog(null);
                        setAicsClassesInfo((aicsClasses) =>
                          aicsClasses.map((currAicsClass) =>
                            currAicsClass.uuid === aicsClassInfo.uuid
                              ? {
                                  ...currAicsClass,
                                  studentUuids:
                                    currAicsClass.studentUuids.filter(
                                      (uuid) => uuid !== student.uuid
                                    )
                                }
                              : currAicsClass
                          )
                        );

                        const newAlert: AlertMessage = {
                          severity: "success",
                          message: "Student unenrolled successfully!",
                          isDeletion: false
                        };
                        setAlerts([...alerts, newAlert]);
                      });
                    }}
                  >
                    PROCEED
                  </Button>
                </DialogActions>
              </Dialog>
              <br />
            </li>
          ))}
        </ol>
        {numOtherStudents > 0 && (
          <div>...and {numOtherStudents} other students.</div>
        )}
      </div>
    ) : (
      <div />
    );
  };

  return (
    <StyledEngineProvider injectFirst>
      <div className={courseregistration.maindiv}>
        <hr />
        {!aicsClassInfo.registrationOpen && (
          <MUIAlert severity="error">
            Registration for this section is not open.
          </MUIAlert>
        )}
        <h3>
          {`${aicsClassInfo.time} EDT (${
            aicsClassInfo.enrollmentLimit - aicsClassInfo.studentUuids.length
          } available spots)`}{" "}
        </h3>

        <br />
        <br />
        {alerts.map((alert: AlertMessage, i) => (
          <Alert key={i} alert={alert} setAlerts={setAlerts} />
        ))}

        {isRegistrationAvailable() && (
          <Autocomplete
            multiple
            options={myStudents.filter(
              (student) =>
                !aicsClassInfo.studentUuids.includes(student.uuid) &&
                !selectedStudents.includes(student)
            )}
            disableCloseOnSelect
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {`${option.firstName} ${option.lastName} (${option.email})`}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add children"
                placeholder="Children added"
              />
            )}
            onChange={(_, newSelectedStudents) => {
              setSelectedStudents(newSelectedStudents);
            }}
            value={selectedStudents}
          />
        )}
        <br />

        <RegisteredStudentList />
        <br />
        {isRegistrationAvailable() && (
          <Button
            variant="contained"
            disabled={
              selectedStudents.length === 0 ||
              selectedStudents.length + aicsClassInfo.studentUuids.length >
                aicsClassInfo.enrollmentLimit
            }
            onClick={handleRegister}
          >
            Register for {aicsClassInfo.name} @ {aicsClassInfo.time} EDT
          </Button>
        )}
      </div>
    </StyledEngineProvider>
  );
};
type CourseRegistrationProps = {
  course: string;
  isReady: boolean;
};

const CourseRegistration: React.FC<CourseRegistrationProps> = ({
  course,
  isReady
}) => {
  const [myStudents, setMyStudents] = useState<Student[]>([]);
  const [aicsClassesInfo, setAicsClassesInfo] = useState<Array<AicsClassInfo>>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isReady) {
      API.getClassesInfo(course).then((classes) => {
        setAicsClassesInfo(classes);
        setIsLoading(false);
      });
    }
    API.getMyStudents().then((students) => {
      setMyStudents(students);
    });
  }, [course, isReady]);

  return (
    <div>
      <h1 className={generalStyles.header1}>{course}</h1>
      <MUIAlert severity="info" sx={{ width: "500px", margin: "auto" }}>
        New sections for our courses may be added as staffing changes are made.
        Feel free to check back in later for new time slots if the current ones
        do not work for you. <b>NOTE: All class times are in EDT.</b> Email
        actoninstituteofcs@gmail.com if you have any questions or{" "}
        <a href="https://forms.gle/HpwYk1YkUiecaA8P9" target="_blank">
          fill out this form
        </a>
        .
      </MUIAlert>
      <MUIAlert
        severity="info"
        sx={{ width: "500px", margin: "auto", marginTop: "20px" }}
      >
        This camp runs for two weeks from 8/7 to 8/17, Monday through Thursday.
        All classes will meet Monday through Thursday for 2 weeks, for a total
        of 8 lessons.
      </MUIAlert>
      {isLoading ? (
        <CircularProgress />
      ) : aicsClassesInfo.length > 0 ? (
        aicsClassesInfo.map((aicsClassInfo, i: number) => (
          <CourseDetails
            key={i}
            aicsClassInfo={aicsClassInfo}
            setAicsClassesInfo={setAicsClassesInfo}
            myStudents={myStudents}
          />
        ))
      ) : (
        <div style={{ textAlign: "center" }}>
          <p>No sections available at this time. Please check again later.</p>
        </div>
      )}
    </div>
  );
};

export default CourseRegistration;
