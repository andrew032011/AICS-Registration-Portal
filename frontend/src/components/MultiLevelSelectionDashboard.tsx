import { Button, StyledEngineProvider } from "@mui/material";
import generalStyles from "../styling/generalpage.module.css";
import multidashboard from "../styling/multidashboard.module.css";

type MultiLevelSelectionDashboardProps = {
  classGroup: string;
  classes: Array<string>;
  testLink: string;
};

const MultiLevelSelectionDashboard = ({
  classGroup,
  classes,
  testLink
}: MultiLevelSelectionDashboardProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <div>
        <h1 className={generalStyles.header1}>{classGroup}</h1>
        <h2 className={generalStyles.header2}>
          Please select a level to sign up for!
        </h2>
        <div className={generalStyles.buttondiv}>
          {classes.map((course, i) => (
            <a key={i} href={`/course-registration/${course}`}>
              <Button variant="contained" sx={{ margin: "10px" }}>
                {course}
              </Button>
            </a>
          ))}
        </div>
        <div className={multidashboard.formdiv}>
          <p> Not sure what level to take? Take the placement test below! </p>
          <br />
          <iframe src={testLink} width="640" height="7015">
            Loading…
          </iframe>
        </div>
      </div>
    </StyledEngineProvider>
  );
};

export default MultiLevelSelectionDashboard;
