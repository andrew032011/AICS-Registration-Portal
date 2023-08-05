import React, { ReactNode, useEffect, useState } from "react";
import Footer from "./Footer";
import API from "../api/API";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import Header from "./Header";

type Props = {
  readonly children?: ReactNode;
};

const Layout = ({ children }: Props): JSX.Element => {
  const { isReady, route } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminPage, setIsAdminPage] = useState<boolean>(false);
  const [userAttributes, setUserAttributes] = useState<UserAttributes>({
    firstName: "",
    lastName: "",
    email: "",
    roles: []
  });

  useEffect(() => {
    if (isReady) {
      const pathParams = route.split("/");
      const pathContainsAdminParam =
        pathParams.length > 0 && pathParams[1] === "admin";
      setIsAdminPage(pathContainsAdminParam);
      API.getMyUserAttributes().then((userAttributes) => {
        setUserAttributes(userAttributes);
        setIsLoading(false);
        if (pathContainsAdminParam && !userAttributes.roles.includes("admin")) {
          window.location.replace("/");
        }
      });
    }
  }, [route, isReady]);

  return isLoading ? (
    <div>
      <CircularProgress />
      Checking permissions...
    </div>
  ) : (
    <div>
      <Header userAttributes={userAttributes} />
      {isAdminPage && !userAttributes.roles.includes("admin") ? (
        <h1>Access Denied. Admin access only.</h1>
      ) : (
        children
      )}
      <Footer />
    </div>
  );
};

export default Layout;
