import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

type PlanItem = {
  week: number;
  focus: string;
  completed?: boolean;
};

type LearningPathType = {
  goal: string;
  daily_time: number;
  generated_plan: PlanItem[];
};

export default function LearningPath() {
  const { user } = useAuth();
  const [path, setPath] = useState<LearningPathType | null>(null);
  const [loading, setLoading] = useState(true);

  if (!user) return null;

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const res = await api.get(`/learning-path/${user.id}`);

        let planData = res.data.plan || res.data.generated_plan;

        // ✅ SAFELY HANDLE STRING OR ARRAY
        if (typeof planData === "string") {
          planData = JSON.parse(planData);
        }

        // Add completed flag if missing
        const normalizedPlan = planData.map((item: PlanItem) => ({
          ...item,
          completed: item.completed ?? false
        }));

        setPath({
          goal: res.data.goal,
          daily_time: res.data.daily_time,
          generated_plan: normalizedPlan
        });
      } catch (err) {
        console.error("No learning path found");
        setPath(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [user.id]);

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading your learning path...
        </p>
      </div>
    );
  }

  // 🧠 NO PATH YET
  if (!path) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          No Learning Path Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Generate your personalized learning path to get started.
        </p>
      </div>
    );
  }

  const completedCount = path.generated_plan.filter(p => p.completed).length;
  const progress = Math.round(
    (completedCount / path.generated_plan.length) * 100
  );

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Your Learning Path
      </h1>

      <p className="text-gray-700 dark:text-gray-300">
        🎯 Goal: <strong>{path.goal}</strong>
      </p>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        ⏱ Daily Time: {path.daily_time} minutes
      </p>

      {/* PROGRESS BAR */}
      <div className="mb-8">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-full">
          <div
            className="h-4 bg-indigo-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Progress: {progress}%
        </p>
      </div>

      {/* PLAN */}
      <div className="space-y-4">
        {path.generated_plan.map((item) => (
          <div
            key={item.week}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold text-indigo-600">
                Week {item.week}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {item.focus}
              </p>
            </div>

            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => {
                const updated = path.generated_plan.map(p =>
                  p.week === item.week
                    ? { ...p, completed: !p.completed }
                    : p
                );
                setPath({ ...path, generated_plan: updated });
              }}
              className="w-6 h-6 accent-indigo-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
