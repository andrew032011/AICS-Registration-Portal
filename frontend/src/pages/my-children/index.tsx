import API from "../../api/API";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import MyStudentsDetails from "../../components/MyStudentsDetails";
import MyStudentsCreationForm from "../../components/MyStudentsCreationForm";
import Alert from "../../components/Alert";
import mystudents from "../../styling/mystudentspage.module.css";

const MyStudentsDashboard = () => {
  const [myStudents, setMyStudents] = useState<Array<Student>>([]);
  const [alerts, setAlerts] = useState<Array<AlertMessage>>([]);
  const [allClassesInfo, setAllClassesInfo] = useState<AicsClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    API.getMyStudents().then((students) => {
      setMyStudents(students);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    API.getClassesInfo().then((classes) => {
      setAllClassesInfo(classes);
    });
  }, []);

  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <ol>
          <div className={mystudents.studentlist}>
            <div>
              <h2>My Children</h2>
              <div className={mystudents.alertdiv}>
                {alerts.map((alert: AlertMessage, i) => (
                  <Alert key={i} alert={alert} setAlerts={setAlerts} />
                ))}
              </div>
              {myStudents.map((student, i) => (
                <MyStudentsDetails
                  key={i}
                  student={student}
                  setMyStudents={setMyStudents}
                  alerts={alerts}
                  setAlerts={setAlerts}
                  allClassesInfo={allClassesInfo}
                />
              ))}
            </div>
            <div className={mystudents.formpadding}>
              <MyStudentsCreationForm setMyStudents={setMyStudents} />
            </div>
          </div>
        </ol>
      )}
    </div>
  );
};

export default MyStudentsDashboard;
