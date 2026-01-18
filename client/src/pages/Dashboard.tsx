import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { getCourseImage } from "../utils/courseImages";

type Course = {
  id: number;
  title: string;
  category: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  if (!user) return null;

  useEffect(() => {
    api.get("/courses").then((res) => {
      setCourses(res.data.slice(0, 3));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* HERO */}
      <div
        className="relative h-[320px] flex items-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-10 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Welcome back, {user.name} 👋
          </h1>
          <p className="mt-3 text-lg text-gray-200">
            Continue learning and grow your skills.
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/courses")}
              className="bg-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Explore Courses
            </button>
            <button
              onClick={() => navigate("/learning-path")}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Learning Path
            </button>
          </div>
        </div>
      </div>

      <div className="p-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Continue Learning
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-2xl transition overflow-hidden"
            >
              {/* SAME IMAGE AS COURSES */}
              <img
                src={getCourseImage(course.id)}
                alt={course.title}
                className="h-36 w-full object-cover"
              />

              <div className="p-6">
                <p className="text-sm font-semibold text-indigo-600">
                  {course.category}
                </p>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                  {course.title}
                </h3>

                <button
                  onClick={() => navigate(`/community/${course.id}`)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Resume Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
