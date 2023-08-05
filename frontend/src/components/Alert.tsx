import DeleteOutline from "@mui/icons-material/DeleteOutline";
import MUIAlert from "@mui/material/Alert";
import { Dispatch, SetStateAction } from "react";

type AlertProps = {
  alert: AlertMessage;
  setAlerts: Dispatch<SetStateAction<Array<AlertMessage>>>;
  key: number;
};

const Alert = ({ alert, setAlerts, key }: AlertProps) => (
  <MUIAlert
    key={key}
    severity={alert.severity}
    style={{ marginBottom: "20px" }}
    icon={alert.isDeletion ? <DeleteOutline /> : null}
    onClose={() => {
      setAlerts((alerts) => alerts.filter((currAlert) => currAlert !== alert));
    }}
  >
    {alert.message}
  </MUIAlert>
);

export default Alert;
