import { useStore } from '../store/useStore';
import WebApp from '@twa-dev/sdk';

export default function Profile() {
  const { user, habits } = useStore();

  const totalHabits = habits.length;
  const completedToday = 0; // TODO: Calculate from today's completions
  const totalStreak = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Профиль</h1>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
              {user?.first_name?.charAt(0) || WebApp.initDataUnsafe.user?.first_name?.charAt(0) || '👤'}
            </div>
            <div>
              <h2 className="font-semibold text-lg">
                {user?.first_name || WebApp.initDataUnsafe.user?.first_name || 'Пользователь'}
              </h2>
              {(user?.username || WebApp.initDataUnsafe.user?.username) && (
                <p className="text-sm text-gray-500">
                  @{user?.username || WebApp.initDataUnsafe.user?.username}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{totalHabits}</div>
              <div className="text-xs text-gray-500 mt-1">Привычек</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{completedToday}</div>
              <div className="text-xs text-gray-500 mt-1">Сегодня</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{totalStreak}</div>
              <div className="text-xs text-gray-500 mt-1">Всего дней</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm divide-y">
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">Настройки</span>
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            <span className="text-gray-700">О приложении</span>
          </button>
        </div>
      </div>
    </div>
  );
}
