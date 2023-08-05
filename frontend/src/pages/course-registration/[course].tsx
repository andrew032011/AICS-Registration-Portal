import { useRouter } from "next/router";
import CourseRegistration from "../CourseRegistration";

const CourseRegistrationPage: React.FC = () => {
  const { query, isReady } = useRouter();
  return (
    <CourseRegistration course={query.course as string} isReady={isReady} />
  );
};

export default CourseRegistrationPage;
