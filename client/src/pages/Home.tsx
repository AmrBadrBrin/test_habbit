import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { habitsApi } from '../api/habits';

export default function Home() {
  const { habits, setHabits, setLoading, setError } = useStore();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await habitsApi.getAll();
      setHabits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (habitId: string) => {
    try {
      await habitsApi.complete(habitId);
      // Reload habits to get updated streak
      await loadHabits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete habit');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Главная</h1>

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет привычек</p>
            <p className="text-sm text-gray-400 mt-2">
              Добавьте свою первую привычку
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{habit.icon}</span>
                  <div>
                    <h3 className="font-semibold">{habit.title}</h3>
                    <p className="text-sm text-gray-500">
                      Streak: {habit.currentStreak || 0} дней
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleComplete(habit.id)}
                  className="w-8 h-8 rounded-full border-2 border-green-500 hover:bg-green-500 hover:text-white transition-colors"
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="fixed bottom-24 right-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-600 transition-colors">
          +
        </button>
      </div>
    </div>
  );
}
