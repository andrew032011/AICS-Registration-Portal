import React from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import { auth } from "../utils/firebase";
import header from "../styling/header.module.css";
import { StyledEngineProvider } from "@mui/material";

type HeaderProps = {
  userAttributes: UserAttributes;
};

const Header = ({ userAttributes }: HeaderProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <div className={header.header}>
        <div className={header.generaldiv}>
          <a href={"/"}>
            <Image
              src="/static/AICS-logo.png"
              alt="AICS Logo"
              width="70"
              height="70"
            />
          </a>
          <a href={"/my-children"}>
            <Button variant="contained" sx={{ margin: "10px" }}>
              My Children
            </Button>
          </a>
          <a href={"/profile"}>
            <Button variant="contained" sx={{ margin: "10px" }}>
              Edit Profile
            </Button>
          </a>
        </div>
        <p style={{ marginLeft: "20px" }}>
          Notice any bugs or have any questions about how to use the portal?{" "}
          <br /> Please email us at actoninstituteofcs@gmail.com for any
          questions or feedback.
          <br />
          You can also{" "}
          <a
            href="https://forms.gle/HpwYk1YkUiecaA8P9"
            style={{ color: "white" }}
            target="_blank"
          >
            fill out this form
          </a>
          .
        </p>
        <h3
          style={{ marginLeft: "20px" }}
        >{`${userAttributes.firstName} ${userAttributes.lastName} (${userAttributes.email})`}</h3>
        <Button
          variant="contained"
          color="error"
          className={header.signoutbutton}
          sx={{ marginRight: "10px" }}
          onClick={() => auth.signOut()}
        >
          Sign Out
        </Button>
      </div>
    </StyledEngineProvider>
  );
};

export default Header;
