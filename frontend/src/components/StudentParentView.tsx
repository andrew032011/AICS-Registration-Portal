import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { TextField } from "@mui/material";
import generalStyles from "../styling/generalpage.module.css";

const columns: GridColDef[] = [
  {
    field: "studentName",
    headerName: "Student Name",
    align: "center",
    headerAlign: "center",
    flex: 1
  },
  {
    field: "studentEmail",
    headerName: "Student Email",
    align: "center",
    headerAlign: "center",
    flex: 1
  },
  {
    field: "parentName",
    headerName: "Parent Name",
    align: "center",
    headerAlign: "center",
    flex: 1
  },
  {
    field: "parentEmail",
    headerName: "Parent Email",
    align: "center",
    headerAlign: "center",
    flex: 1
  },
  {
    field: "classes",
    headerName: "Classes Enrolled",
    align: "center",
    headerAlign: "center",
    flex: 1
  }
];

type StudentParentViewProps = {
  parents: Array<User>;
  aicsClasses: Array<AicsClass>;
};

const StudentParentView = ({
  parents,
  aicsClasses
}: StudentParentViewProps) => {
  const [searchText, setSearchText] = useState("");
  const updatedData = parents
    .flatMap((parent) =>
      parent.students.map((student) => {
        const registeredClasses = aicsClasses
          .filter((aicsClass) =>
            aicsClass.students.some((s) => s.uuid === student.uuid)
          )
          .map((aicsClass) => ({
            name: aicsClass.name,
            time: aicsClass.time,
            teacher: aicsClass.teacher || "TBA"
          }));

        const classes = registeredClasses
          .map(
            (data) => `${data.name} @ ${data.time} (Teacher: ${data.teacher})`
          )
          .join(", ");

        return {
          id: `${student.uuid}-${parent.email}`,
          studentName: `${student.firstName} ${student.lastName}`,
          studentEmail: student.email,
          parentEmail: parent.email,
          parentName: `${parent.firstName} ${parent.lastName}`,
          classes: classes || "None"
        };
      })
    )
    .flat();

  const filteredRows = searchText
    ? updatedData.filter((row) =>
        Object.values(row).some((value) =>
          (value as string)
            .toString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      )
    : updatedData;

  return (
    <div>
      <TextField
        label="Keyword Search"
        value={searchText}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchText(event.target.value);
        }}
        variant="outlined"
      />
      <br />
      <br />
      <DataGrid
        className={generalStyles.datagrid}
        rows={filteredRows}
        columns={columns}
      />
    </div>
  );
};
export default StudentParentView;
