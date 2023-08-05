import MultiLevelSelectionDashboard from "../../components/MultiLevelSelectionDashboard";

const classGroup: string = "Python";
import { pythonCourses } from "../../constants";

const PythonPage = () => {
  return (
    <MultiLevelSelectionDashboard
      classGroup={classGroup}
      classes={pythonCourses}
      testLink="https://docs.google.com/forms/d/14h1MRpq7E3Lq2o5R6pxYgxbIjwr07sZJLDnIEqXWF_Q/viewform"
    />
  );
};

export default PythonPage;
