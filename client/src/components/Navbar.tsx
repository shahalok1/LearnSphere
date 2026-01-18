import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on auth pages
  if (
    ["/", "/signup", "/forgot-password", "/reset-password"].includes(
      location.pathname
    )
  ) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-2xl font-extrabold text-indigo-600"
        >
          LearnSphere
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex gap-6">
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/courses" label="Courses" />
          <NavLink to="/learning-path" label="Learning Path" />
          <NavLink to="/about" label="About" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Hi, <strong>{user.name}</strong>
            </span>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="text-gray-700 dark:text-gray-200 font-medium hover:text-indigo-600 transition"
    >
      {label}
    </Link>
  );
}
