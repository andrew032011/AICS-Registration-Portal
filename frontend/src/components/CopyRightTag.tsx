import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import copyright from "../styling/copyrighttag.module.css";

const CopyRightTag = () => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      className={copyright.copyright}
    >
      {"Copyright © "}
      {new Date().getFullYear()}{" "}
      <Link
        color="inherit"
        href="https://www.actoninstituteofcs.org/"
        target="_blank"
      >
        Acton Institute of Computer Science, Inc.
      </Link>{" "}
    </Typography>
  );
};

export default CopyRightTag;
