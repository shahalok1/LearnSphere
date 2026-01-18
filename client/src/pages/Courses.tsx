import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { getCourseImage } from "../utils/courseImages";

type Course = {
  id: number;
  title: string;
  description: string;
  category: string;
};

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  if (!user) return null;

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data));
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || course.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
        Explore Courses
      </h1>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <input
          placeholder="Search for anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-lg border dark:bg-gray-800 dark:text-white"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-lg border dark:bg-gray-800 dark:text-white"
        >
          <option>All</option>
          <option>Technology</option>
          <option>Frontend</option>
          <option>Backend</option>
        </select>
      </div>

      {/* COURSES */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-2xl transition overflow-hidden cursor-pointer"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <img
              src={getCourseImage(course.id)}
              alt={course.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-6">
              <p className="text-xs font-semibold uppercase text-indigo-600">
                {course.category}
              </p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {course.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
