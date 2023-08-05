import APIWrapper from "./APIWrapper";

const backendURL =
  process.env.ENVIRONMENT === "production"
    ? "/.netlify/functions/api"
    : "http://localhost:9000/.netlify/functions/api";

export default class API {
  static async getMyUserAttributes(): Promise<UserAttributes> {
    return APIWrapper.get(`${backendURL}/getMyUserAttributes`).then(
      (response) => response.data
    );
  }

  static async updateMyUserAttributes(
    userAttributes: UserAttributes
  ): Promise<UserAttributes> {
    return APIWrapper.put(
      `${backendURL}/updateMyUserAttributes`,
      userAttributes
    ).then((response) => response.data);
  }

  static async deleteUser(email?: string): Promise<void> {
    let url = `${backendURL}/deleteUser`;
    if (email) {
      url += `?email=${email}`;
    }
    await APIWrapper.delete(url);
  }

  static async getClasses(course?: string): Promise<AicsClass[]> {
    let url = `${backendURL}/getClasses`;
    if (course) {
      url += `?course=${course}`;
    }
    return APIWrapper.get(url).then((response) => response.data);
  }
  static async getClassesInfo(course?: string): Promise<AicsClassInfo[]> {
    let url = `${backendURL}/getClassesInfo`;
    if (course) {
      url += `?course=${course}`;
    }
    return APIWrapper.get(url).then((response) => response.data);
  }
  static async getAllParents(): Promise<User[]> {
    return APIWrapper.get(`${backendURL}/getAllParents`).then(
      (response) => response.data
    );
  }
  static async getStudent(uuid: string): Promise<Student> {
    return APIWrapper.get(`${backendURL}/getStudent/${uuid}`).then(
      (response) => response.data
    );
  }

  static async getAllStudents(): Promise<Student[]> {
    return APIWrapper.get(`${backendURL}/getAllStudents`).then(
      (response) => response.data
    );
  }

  static async getMyStudents(): Promise<Student[]> {
    return APIWrapper.get(`${backendURL}/getMyStudents`).then(
      (response) => response.data
    );
  }

  static async addStudent(
    student: Student,
    parentEmail?: string
  ): Promise<Student> {
    return APIWrapper.post(`${backendURL}/addStudent`, {
      student: student,
      parentEmail: parentEmail
    }).then((response) => response.data);
  }

  static async updateStudent(student: Student): Promise<Student> {
    return APIWrapper.put(`${backendURL}/updateStudent`, student).then(
      (response) => response.data
    );
  }

  static async deleteStudent(uuid: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/deleteStudent/${uuid}`);
  }

  static async registerStudentsForClass(
    studentUuids: string[],
    classUuid: string
  ): Promise<AicsClassInfo> {
    return APIWrapper.put(`${backendURL}/registerStudentsForClass`, {
      studentUuids: studentUuids,
      classUuid: classUuid
    }).then((response) => response.data);
  }

  static async removeStudentFromClass(
    classUuid: string,
    studentUuid: string
  ): Promise<AicsClassInfo> {
    return APIWrapper.put(`${backendURL}/removeStudentFromClass`, {
      studentUuid: studentUuid,
      classUuid: classUuid
    }).then((response) => response.data);
  }

  static async createClass(
    aicsClassInfo: AicsClassInfo
  ): Promise<AicsClassInfo> {
    return APIWrapper.post(`${backendURL}/createClass`, aicsClassInfo).then(
      (response) => response.data
    );
  }

  static async updateClass(
    aicsClassInfo: AicsClassInfo
  ): Promise<AicsClassInfo> {
    return APIWrapper.put(`${backendURL}/updateClass`, aicsClassInfo).then(
      (response) => response.data
    );
  }

  static async deleteClass(uuid: string): Promise<void> {
    await APIWrapper.delete(`${backendURL}/deleteClass/${uuid}`);
  }
}
