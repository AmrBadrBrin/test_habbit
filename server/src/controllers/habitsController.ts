import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function ensureUser(telegramId: number, username?: string, firstName?: string) {
  let user = await prisma.user.findUnique({
    where: { telegram_id: telegramId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegram_id: telegramId,
        username,
        first_name: firstName,
      },
    });
  }

  return user;
}

export async function getAllHabits(req: AuthenticatedRequest, res: Response) {
  try {
    const telegramUser = req.telegramUser!;
    const user = await ensureUser(telegramUser.id, telegramUser.username, telegramUser.first_name);

    // КРИТИЧЕСКИ ВАЖНО: Фильтруем по user_id!
    const habits = await prisma.habit.findMany({
      where: {
        user_id: user.id,
        is_archived: false,
      },
      include: {
        completions: {
          orderBy: { completed_at: 'desc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Вычисляем streak для каждой привычки
    const habitsWithStreak = habits.map((habit) => ({
      ...habit,
      currentStreak: calculateStreak(habit.completions),
    }));

    res.json(habitsWithStreak);
  } catch (error) {
    console.error('Error getting habits:', error);
    res.status(500).json({ error: 'Failed to get habits' });
  }
}

export async function getHabitById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const telegramUser = req.telegramUser!;
    const user = await ensureUser(telegramUser.id, telegramUser.username, telegramUser.first_name);

    // КРИТИЧЕСКИ ВАЖНО: Проверяем принадлежность привычки пользователю!
    const habit = await prisma.habit.findFirst({
      where: {
        id,
        user_id: user.id,
      },
      include: {
        completions: true,
      },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json({
      ...habit,
      currentStreak: calculateStreak(habit.completions),
    });
  } catch (error) {
    console.error('Error getting habit:', error);
    res.status(500).json({ error: 'Failed to get habit' });
  }
}

export async function createHabit(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, description, icon, reminder_time, target_days } = req.body;
    const telegramUser = req.telegramUser!;
    const user = await ensureUser(telegramUser.id, telegramUser.username, telegramUser.first_name);

    // КРИТИЧЕСКИ ВАЖНО: Автоматически привязываем к текущему пользователю!
    const habit = await prisma.habit.create({
      data: {
        user_id: user.id,
        title,
        description,
        icon,
        reminder_time,
        target_days,
      },
    });

    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
}

export async function updateHabit(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, icon, reminder_time, target_days } = req.body;
    const telegramUser = req.telegramUser!;
    const user = await ensureUser(telegramUser.id, telegramUser.username, telegramUser.first_name);

    // КРИТИЧЕСКИ ВАЖНО: Проверяем принадлежность привычки пользователю!
    const existing = await prisma.habit.findFirst({
      where: { id, user_id: user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const habit = await prisma.habit.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        reminder_time,
        target_days,
      },
    });

    res.json(habit);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ error: 'Failed to update habit' });
  }
}

export async function deleteHabit(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const telegramUser = req.telegramUser!;
    const user = await ensureUser(telegramUser.id, telegramUser.username, telegramUser.first_name);

    // КРИТИЧЕСКИ ВАЖНО: Проверяем принадлежность привычки пользователю!
    const existing = await prisma.habit.findFirst({
      where: { id, user_id: user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await prisma.habit.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
}

export async function completeHabit(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const telegramUser = req.telegramUser!;
    const user = await ensureUser(telegramUser.id, telegramUser.username, telegramUser.first_name);

    // КРИТИЧЕСКИ ВАЖНО: Проверяем принадлежность привычки пользователю!
    const habit = await prisma.habit.findFirst({
      where: { id, user_id: user.id },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.completion.upsert({
      where: {
        habit_id_completed_at: {
          habit_id: id,
          completed_at: today,
        },
      },
      update: {},
      create: {
        habit_id: id,
        completed_at: today,
      },
    });

    res.status(201).send();
  } catch (error) {
    console.error('Error completing habit:', error);
    res.status(500).json({ error: 'Failed to complete habit' });
  }
}

export async function uncompleteHabit(req: AuthenticatedRequest, res: Response) {
  try {
    const { id, date } = req.params;
    const telegramUser = req.telegramUser!;
    const user = await ensureUser(telegramUser.id, telegramUser.username, telegramUser.first_name);

    // КРИТИЧЕСКИ ВАЖНО: Проверяем принадлежность привычки пользователю!
    const habit = await prisma.habit.findFirst({
      where: { id, user_id: user.id },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await prisma.completion.deleteMany({
      where: {
        habit_id: id,
        completed_at: new Date(date),
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error uncompleting habit:', error);
    res.status(500).json({ error: 'Failed to uncomplete habit' });
  }
}

function calculateStreak(completions: Array<{ completed_at: Date }>): number {
  if (completions.length === 0) return 0;

  const sortedDates = completions
    .map((c) => new Date(c.completed_at).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000;

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = sortedDates[i - 1] - sortedDates[i];
    if (diff === 86400000) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
