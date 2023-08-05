import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { CircularProgress } from "@mui/material";

import { User } from "firebase/auth";
import { auth } from "../utils/firebase";
import SignIn from "./SignIn";

import styles from "./UserProvider.module.css";

type UserContextType = { readonly email: string } | "INIT" | null;

const UserContext = createContext<UserContextType>(null);

const getUserEmail = (user: User) => {
  const { email } = user;
  if (email == null) throw new Error();
  return email;
};

export const useUserContext = (): UserContextType => useContext(UserContext);

export const useUserEmail = (): string => {
  const context = useUserContext();
  if (context === "INIT" || context == null) return "@gmail.com";
  return context.email;
};

let cachedUser: User | null = null;

const updateCachedUser = async (userAuth: User) => {
  cachedUser = userAuth;
};

export const getUserIdToken = async (): Promise<string | null> => {
  if (cachedUser == null) return null;
  return cachedUser.getIdToken();
};

export default function UserProvider({
  children
}: {
  readonly children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<UserContextType>("INIT");

  useEffect(
    () =>
      auth.onIdTokenChanged((userAuth) => {
        if (userAuth && userAuth.emailVerified) {
          updateCachedUser(userAuth).then(() =>
            setUser({ email: getUserEmail(userAuth) })
          );
        } else {
          setUser(null);
        }
      }),
    []
  );

  if (user === "INIT") {
    return (
      <div>
        <div className={styles.LoaderContainer}>
          <CircularProgress />
          Signing you in...
        </div>
      </div>
    );
  }
  if (user == null) {
    return (
      <div>
        <SignIn />
      </div>
    );
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
