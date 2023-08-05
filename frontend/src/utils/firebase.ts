import { getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";

export const app =
  getApps().length === 0
    ? initializeApp(
        process.env.ENVIRONMENT === "production"
          ? {
              apiKey: "AIzaSyA-abxc_p72MB_gKHOrKonCSugjNo-0L88",
              authDomain: "aics-registration-prod.firebaseapp.com",
              projectId: "aics-registration-prod",
              storageBucket: "aics-registration-prod.appspot.com",
              messagingSenderId: "521794389265",
              appId: "1:521794389265:web:a25fd41687c2089b8578b0",
              measurementId: "G-PM32BC120E"
            }
          : {
              apiKey: "AIzaSyBlgM3Ese0zV34yMKpgIiVXj_CRPTzmZAU",
              authDomain: "aics-registration-dev.firebaseapp.com",
              projectId: "aics-registration-dev",
              storageBucket: "aics-registration-dev.appspot.com",
              messagingSenderId: "1074582464569",
              appId: "1:1074582464569:web:0f8945ee50254d4339c5e8"
            }
      )
    : getApps()[0];

export const auth: Auth = getAuth(app);
export const provider: GoogleAuthProvider = new GoogleAuthProvider();
