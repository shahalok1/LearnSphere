export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} LearnSphere. All rights reserved.
      </div>
    </footer>
  );
}
