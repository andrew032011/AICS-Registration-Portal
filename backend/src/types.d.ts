/* eslint no-unused-vars: "off" */

type Role = "parent" | "admin";

type Student = {
  email: string;
  firstName: string;
  lastName: string;
  uuid: string;
};

type DBUser = {
  email: string;
  firstName: string;
  lastName: string;
  studentUuids: string[];
  roles: Role[];
};

type UserAttributes = {
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
};

interface User extends UserAttributes {
  students: Student[];
}

interface BaseAicsClass {
  name: string;
  time: string;
  enrollmentLimit: number;
  teacher: string;
  grader: string;
  googleMeetLink: string;
  googleClassroomCode: string;
  registrationOpen: boolean;
  uuid: string;
}

interface AicsClass extends BaseAicsClass {
  students: Student[];
}

interface AicsClassInfo extends BaseAicsClass {
  studentUuids: string[];
}

interface AssignmentInfo {
  name: string;
  lesson: number;
  className: string;
  uuid: string;
}

interface Assignment extends AssignmentInfo {
  grades: Grade[];
}

type Grade = {
  studentUuid: string;
  grade: string;
};
