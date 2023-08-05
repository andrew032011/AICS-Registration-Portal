import admin from "../../styling/admin.module.css";
import API from "../../api/API";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import React from "react";
import StudentParentView from "../../components/StudentParentView";
import generalStyles from "../../styling/generalpage.module.css";
import StudentsCreationForm from "../../components/StudentsCreationForm";

const AdminDirectoryDashboard = () => {
  const [aicsClasses, setAicsClasses] = useState<Array<AicsClass>>([]);
  const [parents, setParents] = useState<Array<User>>([]);

  useEffect(() => {
    API.getClasses().then((classes) => {
      setAicsClasses(
        classes.sort((a, b) => a.name.localeCompare(b.name, "en-US"))
      );
    });
    API.getAllParents().then((parents) => {
      setParents(parents);
    });
  }, []);

  const registrationData = aicsClasses.flatMap((aicsClass) =>
    aicsClass.students.map((student) => {
      const parent = parents.find((parent) =>
        parent.students.some((s) => s.uuid === student.uuid)
      );
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        name: aicsClass.name,
        time: aicsClass.time,
        teacher: aicsClass.teacher,
        studentEmail: student.email,
        parentEmail: parent?.email || "",
        parentName:
          parent?.firstName && parent?.lastName
            ? `${parent.firstName} ${parent.lastName}`
            : "",
        grader: aicsClass.grader,
        googleClass: aicsClass.googleClassroomCode,
        googleMeet: aicsClass.googleMeetLink
      };
    })
  );

  const registrationDataHeaders = [
    { label: "Class", key: "name" },
    { label: "Time", key: "time" },
    { label: "Start Time", key: "startTime" },
    { label: "Teacher", key: "teacher" },
    { label: "Grader", key: "grader" },
    { label: "Student Name", key: "studentName" },
    { label: "Student Email", key: "studentEmail" },
    { label: "Parent Name", key: "parentName" },
    { label: "Parent Email", key: "parentEmail" },
    { label: "Google Classroom Code", key: "googleClass" },
    { label: "Google Meet", key: "googleMeet" }
  ];

  const mailMergeData = aicsClasses.flatMap((aicsClass) =>
    aicsClass.students.map((student) => {
      const parent = parents.find((parent) =>
        parent.students.some((s) => s.uuid === student.uuid)
      );
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        courseName: aicsClass.name + " (" + aicsClass.time + ")",
        teacher: aicsClass.teacher,
        email:
          parent && parent.email !== student.email
            ? `${parent.email}, ${student.email}`
            : parent?.email ?? student.email,
        googleClassroom: aicsClass.googleClassroomCode
      };
    })
  );

  const mailMergeDataHeaders = [
    { label: "Student Name", key: "studentName" },
    { label: "Course", key: "courseName" },
    { label: "Start Date", key: "start" },
    { label: "Teacher", key: "teacher" },
    { label: "Email Address", key: "email" },
    { label: "Report Card Link", key: "reportCard" },
    { label: "Syllabus Link", key: "syllabus" },
    { label: "Google Classroom Code", key: "googleClassroom" }
  ];

  return (
    <div>
      <a href="/admin">
        <Button variant="contained" sx={{ marginTop: "25px" }}>
          Return to Admin Page
        </Button>
      </a>
      {registrationData.length > 0 && (
        <div className={admin.formgeneraldiv}>
          <CSVLink
            data={registrationData}
            headers={registrationDataHeaders}
            filename={"student_registrations.csv"}
            target="_blank"
          >
            <Button variant="contained" color="primary">
              Generate Session Registration Record
            </Button>
          </CSVLink>
        </div>
      )}
      {mailMergeData.length > 0 && (
        <div className={admin.formgeneraldiv}>
          <CSVLink
            data={mailMergeData}
            headers={mailMergeDataHeaders}
            filename={"mail_merge_template.csv"}
            target="_blank"
          >
            {" "}
            <Button variant="contained" color="primary">
              Generate Mail Merge Template
            </Button>
          </CSVLink>
        </div>
      )}
      <h1 className={generalStyles.header1}>Parent/Student Directory</h1>
      <StudentParentView parents={parents} aicsClasses={aicsClasses} />
      <hr />
      <StudentsCreationForm setAllParents={setParents} parents={parents} />
      <hr />
    </div>
  );
};
export default AdminDirectoryDashboard;
