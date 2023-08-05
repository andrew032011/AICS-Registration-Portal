import admin from "firebase-admin";
import { configureAccount } from "./utils/firebase-utils";
import serviceAccount from "./firebase-config.json";
import prodServiceAccount from "./firebase-prod-config.json";
import dotenv from "dotenv";
dotenv.config();

export const app = admin.initializeApp({
  credential: admin.credential.cert(
    configureAccount(
      process.env.ENVIRONMENT === "production"
        ? prodServiceAccount
        : serviceAccount
    )
  )
});

const db = admin.firestore();

export const classesCollection: admin.firestore.CollectionReference<AicsClassInfo> =
  db.collection("classes").withConverter({
    fromFirestore(snapshot): AicsClassInfo {
      return snapshot.data() as AicsClassInfo;
    },
    toFirestore(userData: AicsClassInfo) {
      return userData;
    }
  });

export const studentsCollection: admin.firestore.CollectionReference<Student> =
  db.collection("students").withConverter({
    fromFirestore(snapshot): Student {
      return snapshot.data() as Student;
    },
    toFirestore(userData: Student) {
      return userData;
    }
  });

export const usersCollection: admin.firestore.CollectionReference<DBUser> = db
  .collection("users")
  .withConverter({
    fromFirestore(snapshot): DBUser {
      return snapshot.data() as DBUser;
    },
    toFirestore(userData: DBUser) {
      return userData;
    }
  });

export const assignmentsCollection: admin.firestore.CollectionReference<Assignment> =
  db.collection("assignments").withConverter({
    fromFirestore(snapshot): Assignment {
      return snapshot.data() as Assignment;
    },
    toFirestore(userData: Assignment) {
      return userData;
    }
  });
