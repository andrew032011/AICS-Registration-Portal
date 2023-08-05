import MultiLevelSelectionDashboard from "../../components/MultiLevelSelectionDashboard";

const classGroup: string = "Java";
import { javaCourses } from "../../constants";

const JavaPage = () => {
  return (
    <MultiLevelSelectionDashboard
      classGroup={classGroup}
      classes={javaCourses}
      testLink="https://docs.google.com/forms/d/19wKXFLfYHj3W9rd20QX1G1znBboeOt_1672YndjFZfE/viewform"
    />
  );
};

export default JavaPage;
