import { firestore } from "firebase-admin";

export const getStudentFromDocumentReference = async (
  docRef: firestore.DocumentReference
): Promise<Student> => {
  const snapshot = await docRef.get();
  return snapshot.data() as Student;
};

export const getUuidsFromStudentDocumentReferences = async (
  docRefs: firestore.DocumentReference[]
): Promise<string[]> => {
  const studentUuids = Promise.all(
    docRefs.map(async (studentRef) => {
      const student = await getStudentFromDocumentReference(studentRef);
      return student?.uuid;
    })
  );
  return studentUuids;
};
