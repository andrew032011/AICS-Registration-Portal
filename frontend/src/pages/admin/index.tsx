import home from "../../styling/home.module.css";

import { Button } from "@mui/material";
import React from "react";
import generalStyles from "../../styling/generalpage.module.css";

const AdminCourseRegistrationDashboard = () => {
  return (
    <div className={home.maindiv}>
      <h1 className={generalStyles.header1}>Welcome to the Admin Page!</h1>
      <h2 className={generalStyles.header2}>
        Click on one of the buttons to view the parent/student directory or to
        view all courses.
      </h2>
      <div className={generalStyles.buttondiv}>
        <a href="/admin/directory">
          <Button sx={{ margin: "40px", color: "white" }}>Directory</Button>
        </a>

        <a href="/admin/coursepage">
          <Button sx={{ margin: "40px", color: "white" }}>Courses</Button>
        </a>
      </div>
    </div>
  );
};
export default AdminCourseRegistrationDashboard;
