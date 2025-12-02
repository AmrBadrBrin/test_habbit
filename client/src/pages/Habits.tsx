import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { habitsApi } from '../api/habits';

export default function Habits() {
  const { habits, setHabits, deleteHabit, setLoading, setError } = useStore();

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

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту привычку?')) {
      return;
    }

    try {
      await habitsApi.delete(id);
      deleteHabit(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete habit');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Привычки</h1>

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет привычек</p>
            <p className="text-sm text-gray-400 mt-2">
              Создайте свою первую привычку на главной странице
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{habit.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{habit.title}</h3>
                      {habit.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {habit.description}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Streak: {habit.currentStreak || 0}</span>
                        {habit.target_days && (
                          <span>Цель: {habit.target_days} дней</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        /* TODO: Implement edit */
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm px-2"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="text-red-500 hover:text-red-700 text-sm px-2"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
