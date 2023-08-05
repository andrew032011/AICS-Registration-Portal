import React from "react";
import Typography from "@mui/material/Typography";
import CopyRightTag from "./CopyRightTag";
import footer from "../styling/footer.module.css";

const Footer = () => {
  return (
    <footer className={footer.footer}>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        className={footer.footerdiv}
      >
        <div className={footer.footertext}>
          <a
            href="https://www.actoninstituteofcs.org/terms-and-conditions"
            target="_blank"
            className={footer.terms}
          >
            Terms and Conditions
          </a>{" "}
          <a
            href="https://www.actoninstituteofcs.org/privacy-policy"
            target="_blank"
            className={footer.policy}
          >
            {" "}
            Privacy Policy
          </a>
        </div>
        <CopyRightTag />
      </Typography>
    </footer>
  );
};

export default Footer;
