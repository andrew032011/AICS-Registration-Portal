import Alert from "../../components/Alert";
import API from "../../api/API";
import admin from "../../styling/admin.module.css";

import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  Switch,
  TextField
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import React from "react";
import generalStyles from "../../styling/generalpage.module.css";
import { courses } from "../../constants";

type ClassCreationFormProps = {
  setAicsClasses: Dispatch<SetStateAction<AicsClass[]>>;
};

const ClassCreationForm = ({ setAicsClasses }: ClassCreationFormProps) => {
  const [name, setName] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [enrollmentLimit, setEnrollmentLimit] = useState<string>("");
  const [teacher, setTeacher] = useState<string>("");
  const [grader, setGrader] = useState<string>("");
  const [googleMeetLink, setGoogleMeet] = useState<string>("");
  const [googleClassroomCode, setGoogleClassroom] = useState<string>("");

  const [alerts, setAlerts] = useState<Array<AlertMessage>>([]);

  const addCourse = () => {
    if (name === "" || time === "" || enrollmentLimit == "") {
      const newAlert: AlertMessage = {
        severity: "error",
        message: "Name, time, and student limit cannot be left empty!",
        isDeletion: false
      };
      setAlerts([...alerts, newAlert]);
    } else if (isNaN(Number(enrollmentLimit))) {
      const newAlert: AlertMessage = {
        severity: "error",
        message: "Student limit must be a number!",
        isDeletion: false
      };
      setAlerts([...alerts, newAlert]);
    } else {
      API.createClass({
        name: name,
        time: time,
        enrollmentLimit: Number(enrollmentLimit),
        teacher: teacher,
        grader: grader,
        googleMeetLink: googleMeetLink,
        googleClassroomCode: googleClassroomCode,
        studentUuids: [],
        registrationOpen: false,
        uuid: ""
      }).then((aicsClass) => {
        const newAlert: AlertMessage = {
          severity: "success",
          message: "Class added successfully!",
          isDeletion: false
        };
        setAlerts([...alerts, newAlert]);
        setName("");
        setTime("");
        setEnrollmentLimit("");
        setTeacher("");
        setGoogleClassroom("");
        setGoogleMeet("");
        setGrader("");
        setAicsClasses((aicsClasses) => [
          ...aicsClasses,
          { ...aicsClass, students: [] }
        ]);
      });
    }
  };

  return (
    <div className={admin.formmaindiv}>
      <h2>Add Course</h2>
      {alerts.map((alert: AlertMessage, i) => (
        <Alert key={i} alert={alert} setAlerts={setAlerts} />
      ))}

      <p>Name:</p>
      <Autocomplete
        options={courses}
        sx={{ width: 200 }}
        getOptionLabel={(option) => option}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Radio style={{ marginRight: 8 }} checked={selected} />
            {option}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Name" placeholder="Name" />
        )}
        onChange={(_, selectedName) => {
          setName(selectedName || "");
        }}
        value={name}
      />

      <p>Time:</p>
      <TextField
        label="Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <p>Student Limit:</p>
      <TextField
        label="Student Limit"
        value={enrollmentLimit}
        onChange={(e) => setEnrollmentLimit(e.target.value)}
      />
      <p>Instructor(s):</p>
      <TextField
        label="Instructor"
        value={teacher}
        onChange={(e) => setTeacher(e.target.value)}
      />
      <p>Grader(s):</p>
      <TextField
        label="Grader"
        value={grader}
        onChange={(e) => setGrader(e.target.value)}
      />
      <p>Google Classroom Code:</p>
      <TextField
        label="Google Classroom Code"
        value={googleClassroomCode}
        onChange={(e) => setGoogleClassroom(e.target.value)}
      />
      <p>Google Meet Link:</p>
      <TextField
        label="Google Meet Link"
        value={googleMeetLink}
        onChange={(e) => setGoogleMeet(e.target.value)}
      />
      <br />
      <Button variant="contained" sx={{ width: "200px" }} onClick={addCourse}>
        Add Course
      </Button>
    </div>
  );
};

type ClassAdminDetailsProps = {
  aicsClass: AicsClass;
  setAicsClasses: Dispatch<SetStateAction<AicsClass[]>>;
  students: Student[];
};

const ClassAdminDetails = ({
  aicsClass,
  setAicsClasses,
  students
}: ClassAdminDetailsProps) => {
  const [openedConfirmationDialog, setOpenedConfirmationDialog] =
    useState<boolean>(false);
  const [
    openedUnenrollConfirmationDialog,
    setOpenedUnenrollConfirmationDialog
  ] = useState<string | null>(null);
  const [name, setName] = useState<string>(aicsClass.name);
  const [time, setTime] = useState<string>(aicsClass.time);
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [enrollmentLimit, setEnrollmentLimit] = useState<number>(
    aicsClass.enrollmentLimit
  );
  const [teacher, setTeacher] = useState<string>(aicsClass.teacher);

  const [grader, setGrader] = useState<string>(aicsClass.grader);
  const [googleMeetLink, setGoogleMeetLink] = useState<string>(
    aicsClass.googleMeetLink
  );
  const [googleClassroomCode, setGoogleClassroomCode] = useState<string>(
    aicsClass.googleClassroomCode
  );
  const [alerts, setAlerts] = useState<Array<AlertMessage>>([]);
  const haveTextFieldsChanged = () =>
    aicsClass.name !== name ||
    aicsClass.time !== time ||
    aicsClass.enrollmentLimit !== enrollmentLimit ||
    aicsClass.teacher !== teacher ||
    aicsClass.googleClassroomCode !== googleClassroomCode ||
    aicsClass.googleMeetLink !== googleMeetLink ||
    aicsClass.grader !== grader;

  const handleSaveChanges = () => {
    API.updateClass({
      ...aicsClass,
      name: name,
      time: time,
      enrollmentLimit: enrollmentLimit,
      teacher: teacher,
      grader: grader,
      googleClassroomCode: googleClassroomCode,
      googleMeetLink: googleMeetLink,
      studentUuids: aicsClass.students.map((student) => student.uuid)
    }).then(() => {
      const newAlert: AlertMessage = {
        severity: "success",
        message: "Saved successfully!",
        isDeletion: false
      };
      setAlerts([...alerts, newAlert]);

      setAicsClasses((aicsClasses) =>
        aicsClasses.map((currAicsClass) =>
          currAicsClass === aicsClass
            ? {
                ...currAicsClass,
                name: name,
                time: time,
                enrollmentLimit: enrollmentLimit,
                teacher: teacher,
                grader: grader,
                googleClassroomCode: googleClassroomCode,
                googleMeetLink: googleMeetLink
              }
            : currAicsClass
        )
      );
    });
  };

  const handleRegister = () => {
    API.registerStudentsForClass(
      selectedStudents.map((student) => student.uuid),
      aicsClass.uuid
    ).then(() => {
      const updatedAicsClassInfo = {
        ...aicsClass,
        students: aicsClass.students.concat(selectedStudents)
      };

      setAicsClasses((prevAicsClasses) =>
        prevAicsClasses.map((prevAicsClassInfo) =>
          prevAicsClassInfo.uuid === updatedAicsClassInfo.uuid
            ? updatedAicsClassInfo
            : prevAicsClassInfo
        )
      );

      setSelectedStudents([]);
    });
  };

  return (
    <div className={admin.maindiv}>
      <h2>{`${aicsClass.name} (${aicsClass.time})`}</h2>
      {alerts.map((alert: AlertMessage, i) => (
        <Alert key={i} alert={alert} setAlerts={setAlerts} />
      ))}

      <FormControlLabel
        control={
          <Switch
            checked={aicsClass.registrationOpen}
            onChange={() =>
              API.updateClass({
                ...aicsClass,
                studentUuids: aicsClass.students.map((student) => student.uuid),
                registrationOpen: !aicsClass.registrationOpen
              }).then(() => {
                setAicsClasses((aicsClasses) =>
                  aicsClasses.map((currAicsClass) =>
                    currAicsClass === aicsClass
                      ? {
                          ...currAicsClass,
                          registrationOpen: !currAicsClass.registrationOpen
                        }
                      : currAicsClass
                  )
                );
              })
            }
          />
        }
        label="Registration Open"
        labelPlacement="start"
      />

      {isEditEnabled ? (
        <>
          <p>Class Name:</p>
          <Autocomplete
            options={courses}
            sx={{ width: 200 }}
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Radio style={{ marginRight: 8 }} checked={selected} />
                {option}
              </li>
            )}
            defaultValue={aicsClass.name}
            renderInput={(params) => (
              <TextField {...params} label="Name" placeholder="Name" />
            )}
            onChange={(_, selectedName) => {
              setName(selectedName || "");
            }}
            value={name}
          />
          <p>Time:</p>
          <TextField
            label="Time"
            defaultValue={aicsClass.time}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <p>Student Limit:</p>
          <TextField
            label="Student Limit"
            defaultValue={aicsClass.enrollmentLimit}
            value={enrollmentLimit}
            onChange={(e) => setEnrollmentLimit(Number(e.target.value))}
          />
          <p>Instructor(s):</p>
          <TextField
            label="Instructor(s)"
            defaultValue={aicsClass.teacher}
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
          <p>Grader(s):</p>
          <TextField
            label="Grader"
            defaultValue={aicsClass.grader}
            value={grader}
            onChange={(e) => setGrader(e.target.value)}
          />
          <p>Google Classroom Code:</p>
          <TextField
            label="Google Classroom Code"
            defaultValue={aicsClass.googleClassroomCode}
            value={googleClassroomCode}
            onChange={(e) => setGoogleClassroomCode(e.target.value)}
          />
          <p>Google Meet Link:</p>
          <TextField
            label="Google Meet Link"
            defaultValue={aicsClass.googleMeetLink}
            value={googleMeetLink}
            onChange={(e) => setGoogleMeetLink(e.target.value)}
          />
          <p>
            Students{" "}
            {`(${
              aicsClass.enrollmentLimit - aicsClass.students.length
            } available spots)`}
            :
          </p>

          <Button
            className={admin.editbutton}
            variant="contained"
            disabled={!haveTextFieldsChanged() && !isEditEnabled}
            onClick={() => {
              setIsEditEnabled(false);
              if (haveTextFieldsChanged()) {
                handleSaveChanges();
              }
            }}
            sx={{ marginTop: "16px" }}
          >
            {!haveTextFieldsChanged() ? "Cancel" : "Save Changes"}
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            className={admin.editbutton}
            onClick={() => setIsEditEnabled(true)}
          >
            Edit
          </Button>
          <p>Student Limit: {aicsClass.enrollmentLimit} </p>

          <p>Instructor(s): {aicsClass.teacher} </p>
          <p>Grader(s): {aicsClass.grader} </p>
          <p>Google Classroom Code: {aicsClass.googleClassroomCode} </p>
          <p>Google Meet Link: {aicsClass.googleMeetLink} </p>
          <p>
            Students{" "}
            {`(${
              aicsClass.enrollmentLimit - aicsClass.students.length
            } available spots)`}
            :
          </p>
        </>
      )}

      <ol>
        {aicsClass.students.map((student, i) => (
          <li key={i} className={admin.list}>
            <div className={admin.studentlist}>
              <div>{`${student.firstName} ${student.lastName} (${student.email})`}</div>
              <Button
                variant="contained"
                color="error"
                className={generalStyles.unenroll}
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
                {`Are you sure you want to unenroll ${student.firstName} ${student.lastName} from ${aicsClass.name} (${aicsClass.time})?`}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please confirm that you want to unenroll {student.firstName}{" "}
                  {student.lastName} from {aicsClass.name} ({aicsClass.time}).
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  className={generalStyles.cancelProceedButton}
                  onClick={() => setOpenedUnenrollConfirmationDialog(null)}
                >
                  CANCEL
                </Button>
                <Button
                  className={generalStyles.cancelProceedButton}
                  onClick={() => {
                    API.removeStudentFromClass(
                      aicsClass.uuid,
                      student.uuid
                    ).then(() => {
                      setOpenedUnenrollConfirmationDialog(null);
                      setAicsClasses((aicsClasses) =>
                        aicsClasses.map((currAicsClass) =>
                          currAicsClass === aicsClass
                            ? {
                                ...aicsClass,
                                students: aicsClass.students.filter(
                                  (currStudent) =>
                                    student.uuid !== currStudent.uuid
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
          </li>
        ))}
      </ol>
      {aicsClass.registrationOpen && (
        <div>
          <Autocomplete
            multiple
            options={students}
            sx={{ width: 300 }}
            disableCloseOnSelect
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName} (${option.email})`
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox style={{ marginRight: 8 }} checked={selected} />
                {`${option.firstName} ${option.lastName} (${option.email})`}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Register students"
                placeholder="Students registered"
              />
            )}
            onChange={(_, newSelectedStudents) => {
              setSelectedStudents(newSelectedStudents);
            }}
            value={selectedStudents}
          />
          <Button
            variant="contained"
            disabled={
              selectedStudents.length === 0 ||
              selectedStudents.length + aicsClass.students.length >
                aicsClass.enrollmentLimit
            }
            onClick={handleRegister}
            sx={{ marginTop: "16px" }}
          >
            Register students for {aicsClass.name} @ {aicsClass.time}
          </Button>
        </div>
      )}

      <Dialog
        open={openedConfirmationDialog}
        onClose={() => setOpenedConfirmationDialog(false)}
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete "${aicsClass.name} (${aicsClass.time})"?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please confirm that you want to delete the course {aicsClass.name}.
            <br />
            WARNING: Once the course is deleted, there is no way to recover it.
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
              API.deleteClass(aicsClass.uuid).then(() => {
                setAicsClasses((aicsClasses) =>
                  aicsClasses.filter(
                    (curAicsClass) => curAicsClass !== aicsClass
                  )
                );
              });
              setOpenedConfirmationDialog(false);
            }}
          >
            PROCEED
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        color="error"
        className={generalStyles.deleteButton}
        sx={{ marginTop: "16px" }}
        onClick={() => {
          setOpenedConfirmationDialog(true);
        }}
      >
        Delete Class
      </Button>
    </div>
  );
};

const CoursePage = () => {
  const [aicsClasses, setAicsClasses] = useState<Array<AicsClass>>([]);
  const [students, setStudents] = useState<Array<Student>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<Array<AlertMessage>>([]);

  useEffect(() => {
    API.getClasses().then((classes) => {
      setAicsClasses(
        classes.sort((a, b) => a.name.localeCompare(b.name, "en-US"))
      );
      setIsLoading(false);
    });
    API.getAllStudents().then((students) => setStudents(students));
  }, []);

  const groupedClasses = aicsClasses.reduce((groups, aicsClass) => {
    const groupName = aicsClass.name;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(aicsClass);
    return groups;
  }, {} as { [name: string]: AicsClass[] });

  const setRegistrationStateForAllClasses = (registrationOpen: boolean) => {
    aicsClasses.map((aicsClass) => {
      API.updateClass({
        ...aicsClass,
        studentUuids: aicsClass.students.map((student) => student.uuid),
        registrationOpen: registrationOpen
      }).then(() => {
        setAicsClasses((aicsClasses) =>
          aicsClasses.map((currAicsClass) =>
            currAicsClass === aicsClass
              ? {
                  ...currAicsClass,
                  registrationOpen: registrationOpen
                }
              : currAicsClass
          )
        );
      });
    });

    const message = registrationOpen
      ? "Registration opened for all classes!"
      : "Registration closed for all classes!";

    const newAlert: AlertMessage = {
      severity: "success",
      message: message,
      isDeletion: false
    };
    setAlerts([...alerts, newAlert]);
  };

  return (
    <div>
      <ClassCreationForm setAicsClasses={setAicsClasses} />
      <h1 className={generalStyles.header1}>
        Courses ({aicsClasses.length} Section{aicsClasses.length > 1 ? "s" : ""}{" "}
        Total)
      </h1>
      {alerts.map((alert: AlertMessage, i) => (
        <Alert key={i} alert={alert} setAlerts={setAlerts} />
      ))}
      <div className={admin.opencloseregistrationdiv}>
        <Button
          variant="contained"
          color="success"
          className={generalStyles.openButton}
          onClick={() => setRegistrationStateForAllClasses(true)}
        >
          Open All Registration
        </Button>
        <Button
          variant="contained"
          color="error"
          className={generalStyles.close}
          style={{ marginLeft: "10px" }}
          onClick={() => setRegistrationStateForAllClasses(false)}
        >
          Close All Registration
        </Button>
      </div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className={admin.classheaderdiv}>
          {Object.entries(groupedClasses).map(([groupName, group]) => (
            <React.Fragment key={groupName}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2 className={admin.classheaders}>
                  {groupName} (Number of Class Sections: {group.length})
                </h2>
              </div>
              <div className={admin.classdetailsdiv}>
                {group.map((aicsClass) => (
                  <ClassAdminDetails
                    key={aicsClass.uuid}
                    aicsClass={aicsClass}
                    setAicsClasses={setAicsClasses}
                    students={students}
                  />
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursePage;
