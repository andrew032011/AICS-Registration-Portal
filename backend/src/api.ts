import express, { RequestHandler, Request, Response } from "express";
import serverless from "serverless-http";
import cors from "cors";
import admin from "firebase-admin";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import {
  app as firebaseApp,
  classesCollection,
  usersCollection,
  studentsCollection
} from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { getStudentFromDocumentReference } from "./utils/studentUtils";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import PermissionsUtils from "./utils/permissions-utils";

// Constants and configurations
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 9000;

const allowedOrigins = [
  /http:\/\/localhost:3000/,
  "https://actoninstituteofcs.netlify.app/",
  /.*--actoninstituteofcs\.netlify\.app/
];

// // Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json({ limit: "50mb" }));

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(
        (info) =>
          `${info.timestamp} ${info.level} - ${info.meta.req.method} ${
            info.meta.req.originalUrl
          } ${info.meta.res.statusCode} -- ${JSON.stringify(
            info.meta.req.body
          )}`
      )
    ),
    requestWhitelist: ["body", "method", "originalUrl"],
    responseWhitelist: ["body", "statusCode"]
  })
);

type AuthUser = {
  name: string | undefined;
  email: string | undefined;
};

const getAuthUserFromRequest = async (
  request: Request
): Promise<AuthUser | undefined> => {
  const idToken = request.headers["auth-token"];
  if (typeof idToken !== "string") return undefined;
  const decodedToken: DecodedIdToken = await admin
    .auth(firebaseApp)
    .verifyIdToken(idToken);
  return { name: decodedToken.name, email: decodedToken.email };
};

const loginCheckedHandler =
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (req: Request, user: DBUser) => Promise<[any, number]>
  ): RequestHandler =>
  async (req: Request, res: Response): Promise<void> => {
    const authUser = await getAuthUserFromRequest(req);
    if (authUser == null || authUser.email == null) {
      res.status(401).json({ error: "Not logged in!" });
      return;
    }
    const userDoc = await usersCollection.doc(authUser.email).get();
    let user = userDoc.data() as DBUser;
    if (!user) {
      let firstName;
      let lastName;

      if (authUser.name == null) {
        firstName = "";
        lastName = "";
      } else if (authUser.name.indexOf(" ") === -1) {
        firstName = authUser.name;
        lastName = "";
      } else {
        firstName = authUser.name.substring(0, authUser.name.indexOf(" "));
        lastName = authUser.name.substring(authUser.name.indexOf(" ") + 1);
      }

      // Create user
      user = {
        firstName: firstName,
        lastName: lastName,
        email: authUser.email,
        roles: ["parent"],
        studentUuids: []
      };
      const userRef = usersCollection.doc(authUser.email);
      await userRef.set(user);
    }
    try {
      const [result, statusCode] = await handler(req, user);
      res.status(statusCode).send(result);
    } catch (error) {
      res
        .status(500)
        .send({ error: `Failed to handle the request due to ${error}.` });
    }
  };

const studentUuidToStudentInfo = async (studentUuid: string) => {
  const studentDoc = studentsCollection.doc(studentUuid);
  const studentRef = await studentDoc.get();
  return studentRef.data() as Student;
};

const deleteStudentByUuid = async (uuid: string) => {
  const deletedStudentRef = studentsCollection.doc(uuid);

  // Remove student/parent association
  const userRefs = await usersCollection
    .where("studentUuids", "array-contains", uuid)
    .get();

  await Promise.all(
    userRefs.docs.map(async (userRef) => {
      const dbUser = userRef.data() as DBUser;
      const studentUuids = dbUser.studentUuids.filter(
        (studentUuid) => studentUuid !== uuid
      );
      await usersCollection
        .doc(dbUser.email)
        .update({ studentUuids: studentUuids });
    })
  );

  // Remove student/class association
  const classRefs = await classesCollection
    .where("studentUuids", "array-contains", uuid)
    .get();

  await Promise.all(
    classRefs.docs.map(async (classRef) => {
      const aicsClassInfo = classRef.data() as AicsClassInfo;
      const studentUuids = aicsClassInfo.studentUuids.filter(
        (studentUuid) => studentUuid !== uuid
      );
      await classesCollection
        .doc(aicsClassInfo.uuid)
        .update({ studentUuids: studentUuids });
    })
  );

  // Delete student doc from collection
  await deletedStudentRef.delete();
};

const loginCheckedGet = (
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: Request, user: DBUser) => Promise<[any, number]>
) => router.get(path, loginCheckedHandler(handler));

const loginCheckedPost = (
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: Request, user: DBUser) => Promise<[any, number]>
) => router.post(path, loginCheckedHandler(handler));

const loginCheckedPut = (
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: Request, user: DBUser) => Promise<[any, number]>
) => router.put(path, loginCheckedHandler(handler));

const loginCheckedDelete = (
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: Request, user: DBUser) => Promise<[any, number]>
) => router.delete(path, loginCheckedHandler(handler));

loginCheckedGet("/getMyUserAttributes", async ({}, user) => {
  return [
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles
    },
    200
  ];
});

loginCheckedPut("/updateMyUserAttributes", async (req, user) => {
  const userAttributes = req.body;
  await usersCollection.doc(user.email).set({
    ...user,
    firstName: userAttributes.firstName,
    lastName: userAttributes.lastName
  });
  return [userAttributes, 200];
});

loginCheckedDelete("/deleteUser", async (req, user) => {
  let email;

  // If no query param for email is specified, delete the logged in user
  if (req.params.email) {
    if (PermissionsUtils.isAdmin(user) || user.email === req.query.email) {
      email = req.query.email;
    } else {
      return [
        {
          statusMessage:
            "Non-admins cannot delete accounts other than their own."
        },
        403
      ];
    }
  } else {
    email = user.email;
  }

  const userRef = usersCollection.doc(email);
  const userDoc = await userRef.get();
  const data = userDoc.data() as DBUser;

  for (const studentUuid of data.studentUuids) {
    await deleteStudentByUuid(studentUuid);
  }

  await userRef.delete();
  return [{}, 204];
});

loginCheckedGet("/getClasses", async (req, user) => {
  if (!PermissionsUtils.isAdmin(user)) {
    return [{ statusMessage: "Only admins can get class data." }, 403];
  }

  let aicsClassRefs;
  if (req.query.course) {
    aicsClassRefs = await classesCollection
      .where("name", "==", req.query.course)
      .get();
  } else {
    aicsClassRefs = await classesCollection.get();
  }
  const result: AicsClass[] = await Promise.all(
    aicsClassRefs.docs.map(async (aicsClassRef) => {
      const aicsClass: AicsClassInfo = aicsClassRef.data();
      const students = await Promise.all(
        aicsClass.studentUuids.map(studentUuidToStudentInfo)
      );
      const studentsNoUndefElements = students.filter(
        (student) => student !== undefined
      );
      const numUndefElements = students.length - studentsNoUndefElements.length;

      if (numUndefElements > 0) {
        console.warn(
          `Found ${numUndefElements} invalid student UUIDs for class ${aicsClass.uuid} in DB.`
        );
      }

      return {
        ...aicsClass,
        students: studentsNoUndefElements
      };
    })
  );
  return [result, 200];
});

loginCheckedGet("/getClassesInfo", async (req, {}) => {
  let aicsClassRefs;
  if (req.query.course) {
    aicsClassRefs = await classesCollection
      .where("name", "==", req.query.course)
      .get();
  } else {
    aicsClassRefs = await classesCollection.get();
  }
  const result: AicsClassInfo[] = await Promise.all(
    aicsClassRefs.docs.map(
      (aicsClassRef) => aicsClassRef.data() as AicsClassInfo
    )
  );
  return [result, 200];
});

loginCheckedGet("/getAllParents", async ({}, user) => {
  if (!PermissionsUtils.isAdmin(user)) {
    return [{ statusMessage: "Only admins can get all parent data." }, 403];
  }

  const userRefs = await usersCollection
    .where("roles", "array-contains", "parent")
    .get();
  const result: User[] = await Promise.all(
    userRefs.docs.map(async (userRef) => {
      const data = userRef.data() as DBUser;
      const students = await Promise.all(
        data.studentUuids.map(async (studentUuid) => {
          const studentRef = studentsCollection.doc(studentUuid);
          return await getStudentFromDocumentReference(studentRef);
        })
      );
      const studentsNoUndefElements = students.filter(
        (student) => student !== undefined
      );
      const numUndefElements = students.length - studentsNoUndefElements.length;

      if (numUndefElements > 0) {
        console.warn(
          `Found ${numUndefElements} invalid student references for parent ${data.email} in DB.`
        );
      }
      return {
        ...data,
        students: studentsNoUndefElements
      };
    })
  );
  return [result, 200];
});

loginCheckedGet("/getStudent/:uuid", async (req, user) => {
  const studentUuid = req.params.uuid;

  if (
    !PermissionsUtils.isAdmin(user) &&
    !user.studentUuids.includes(studentUuid)
  ) {
    return [
      {
        statusMessage:
          "Only admins and parents of a student can get student data."
      },
      403
    ];
  }

  const studentRef = await studentsCollection.doc(studentUuid).get();
  const data = studentRef.data() as Student;

  return [data, 200];
});

loginCheckedGet("/getAllStudents", async ({}, user) => {
  if (!PermissionsUtils.isAdmin(user)) {
    return [{ statusMessage: "Only admins can get all student data." }, 403];
  }

  const studentRefs = await studentsCollection.get();
  const result: Student[] = await Promise.all(
    studentRefs.docs.map((studentRef) => studentRef.data() as Student)
  );
  return [result, 200];
});

loginCheckedGet("/getMyStudents", async ({}, user) => {
  const doc = await usersCollection.doc(user.email).get();
  const data = doc.data() as DBUser;
  const result = await Promise.all(
    data.studentUuids.map(async (studentUuid) => {
      const studentRef = studentsCollection.doc(studentUuid);
      return await getStudentFromDocumentReference(studentRef);
    })
  );
  const resultNoUndefElements = result.filter(
    (student) => student !== undefined
  );
  const numUndefElements = result.length - resultNoUndefElements.length;

  if (numUndefElements > 0) {
    console.warn(
      `Found ${numUndefElements} invalid student references for parent ${data.email} in DB.`
    );
  }

  return [resultNoUndefElements, 200];
});

loginCheckedPost("/addStudent", async (req, user) => {
  //Check for parent's email
  let parentEmail;
  if (req.body.parentEmail != null) {
    if (
      !PermissionsUtils.isAdmin(user) &&
      user.email !== req.body.parentEmail
    ) {
      return [
        { statusMessage: "Only admins can add students for other users." },
        403
      ];
    }
    parentEmail = req.body.parentEmail;
  } else {
    parentEmail = user.email;
  }

  // Add student to students collection
  const student = {
    ...req.body.student,
    uuid: uuidv4()
  };
  const studentRef = studentsCollection.doc(student.uuid);
  await studentRef.set(student);

  // Associate student with parent
  const doc = await usersCollection.doc(parentEmail).get();
  const data = doc.data() as DBUser;

  const studentUuids = data.studentUuids;
  studentUuids.push(student.uuid);

  await usersCollection.doc(parentEmail).update({ studentUuids: studentUuids });

  return [student, 201];
});

loginCheckedPut("/updateStudent", async (req, user) => {
  const student: Student = req.body;
  if (
    !PermissionsUtils.isAdmin(user) &&
    !user.studentUuids.includes(student.uuid)
  ) {
    return [
      {
        statusMessage: `Only admins or the parent of student ${student.uuid} can update the student.`
      },
      403
    ];
  }

  await studentsCollection.doc(student.uuid).set(student);
  return [student, 200];
});

loginCheckedDelete("/deleteStudent/:uuid", async (req, user) => {
  if (
    !PermissionsUtils.isAdmin(user) &&
    !user.studentUuids.includes(req.params.uuid)
  ) {
    return [
      {
        statusMessage: `Only admins or the parent of student ${req.params.uuid} can delete the student.`
      },
      403
    ];
  }

  await deleteStudentByUuid(req.params.uuid);
  return [{}, 204];
});

loginCheckedPut("/registerStudentsForClass", async (req, user) => {
  const doc = await classesCollection.doc(req.body.classUuid).get();
  const data = doc.data() as AicsClassInfo;
  const studentUuids = data.studentUuids;
  const reqStudentUuids = req.body.studentUuids;
  if (!data.registrationOpen) {
    return [
      {
        statusMessage:
          "Cannot register for a class whose registration is closed."
      },
      400
    ];
  }

  if (data.studentUuids.length >= data.enrollmentLimit) {
    return [{ statusMessage: "Cannot register for a class that is full" }, 400];
  }
  for (const uuid of reqStudentUuids) {
    if (!PermissionsUtils.isAdmin(user) && !user.studentUuids.includes(uuid)) {
      console.warn(
        `Only admins or the parent of student ${uuid} can register the student to a class.`
      );
      continue;
    }
    if (!studentUuids.includes(uuid)) {
      studentUuids.push(uuid);
    }
  }

  await classesCollection
    .doc(req.body.classUuid)
    .update({ studentUuids: studentUuids });

  return [data, 200];
});

loginCheckedPut("/removeStudentFromClass", async (req, user) => {
  const studentUuid = req.body.studentUuid;
  if (
    !PermissionsUtils.isAdmin(user) &&
    !user.studentUuids.includes(studentUuid)
  ) {
    return [
      {
        statusMessage: `Only admins or the parent of student ${studentUuid} can remove student from class.`
      },
      403
    ];
  }

  const classUuid = req.body.classUuid;
  const classDoc = await classesCollection.doc(classUuid).get();
  const classData = classDoc.data() as AicsClassInfo;
  const updatedStudentUuids = classData.studentUuids.filter(
    (uuid) => uuid !== studentUuid
  );
  await classesCollection
    .doc(classUuid)
    .update({ studentUuids: updatedStudentUuids });
  return [classData, 200];
});

loginCheckedPost("/createClass", async (req, user) => {
  if (!PermissionsUtils.isAdmin(user)) {
    return [{ statusMessage: "Only admins can create classes." }, 403];
  }

  const aicsClassInfo = {
    ...req.body,
    studentUuids: [],
    uuid: uuidv4()
  };
  await classesCollection.doc(aicsClassInfo.uuid).set(aicsClassInfo);
  return [aicsClassInfo, 201];
});

loginCheckedPut("/updateClass", async (req, user) => {
  if (!PermissionsUtils.isAdmin(user)) {
    return [{ statusMessage: "Only admins can update classes." }, 403];
  }

  const classRef = classesCollection.doc(req.body.uuid);
  const doc = await classRef.get();
  const data = doc.data() as AicsClassInfo;
  const aicsClassInfo: AicsClassInfo = {
    ...req.body,
    studentUuids: data.studentUuids
  };
  await classRef.set(aicsClassInfo);
  return [aicsClassInfo, 200];
});

loginCheckedDelete("/deleteClass/:uuid", async (req, user) => {
  if (!PermissionsUtils.isAdmin(user)) {
    return [{ statusMessage: "Only admins can delete classes." }, 403];
  }

  const deletedClassRef = classesCollection.doc(req.params.uuid);
  await deletedClassRef.delete();
  return [{}, 204];
});

app.use("/.netlify/functions/api", router);

if (process.env.ENVIRONMENT !== "production") {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on port: ${PORT}`);
  });
}
export const handler = serverless(app);
