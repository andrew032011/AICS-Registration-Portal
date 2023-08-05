import Button from "@mui/material/Button";
import generalStyles from "../styling/generalpage.module.css";
import home from "../styling/home.module.css";

const classGroups = ["Python", "Java"];
const courses = ["SAT Math", "Scratch", "HTML"];

const SignUpDashboard = () => {
  return (
    <div className={home.maindiv}>
      <h1 className={generalStyles.header1}>
        Welcome to the AICS Registration Portal!
      </h1>
      <h2 className={generalStyles.header2}>
        {" "}
        Please select a course to sign up for!{" "}
      </h2>
      <div className={generalStyles.buttondiv}>
        {classGroups.map((course, i) => (
          <a key={i} href={`/${course.toLowerCase()}`}>
            <Button variant="contained" sx={{ margin: "10px" }}>
              {course}
            </Button>
          </a>
        ))}
        {courses.map((course, i) => (
          <a key={i} href={`/course-registration/${course}`}>
            <Button variant="contained" sx={{ margin: "10px" }}>
              {course}
            </Button>
          </a>
        ))}
      </div>
      <Button
        variant="contained"
        sx={{ margin: "50px auto", width: "200px", textAlign: "center" }}
        href="https://docs.google.com/document/d/1XyWpQEXS5YPpIm4neJuyJVhp9gC3Nz6lHQTid5O4a2U/edit"
        target="_blank"
      >
        Registration Tutorial
      </Button>
    </div>
  );
};

export default SignUpDashboard;
