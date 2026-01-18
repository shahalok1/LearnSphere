import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { getCourseImage } from "../utils/courseImages";
import { useAuth } from "../context/AuthContext";

type Course = {
  id: number;
  title: string;
  description: string;
  category: string;
};

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);

  if (!user) return null;

  useEffect(() => {
    api.get("/courses").then((res) => {
      const found = res.data.find(
        (c: Course) => c.id === Number(id)
      );
      setCourse(found);
    });
  }, [id]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading course...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* HERO */}
      <div className="bg-gray-900 text-white p-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-4">
              {course.title}
            </h1>
            <p className="text-gray-300 mb-6">
              {course.description}
            </p>
            <button className="bg-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Enroll Now
            </button>
          </div>

          <img
            src={getCourseImage(course.id)}
            alt={course.title}
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto p-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What you’ll learn
        </h2>

        <ul className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <li>✔ Build real-world projects</li>
          <li>✔ Master core concepts</li>
          <li>✔ Improve problem-solving</li>
          <li>✔ Become job-ready</li>
        </ul>
      </div>
    </div>
  );
}
