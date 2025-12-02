import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface AuthenticatedRequest extends Request {
  telegramUser?: TelegramUser;
}

export function validateTelegramWebAppData(
  telegramInitData: string,
  botToken: string
): TelegramUser | null {
  try {
    const initData = new URLSearchParams(telegramInitData);
    const hash = initData.get('hash');
    const dataToCheck: string[] = [];

    initData.sort();
    initData.forEach((val, key) => {
      if (key !== 'hash') {
        dataToCheck.push(`${key}=${val}`);
      }
    });

    const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = crypto
      .createHmac('sha256', secret)
      .update(dataToCheck.join('\n'))
      .digest('hex');

    if (calculatedHash !== hash) {
      return null;
    }

    const userStr = initData.get('user');
    if (!userStr) {
      return null;
    }

    return JSON.parse(userStr);
  } catch (error) {
    console.error('Telegram auth validation error:', error);
    return null;
  }
}

export function authenticateTelegram(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const initData = req.headers['x-telegram-init-data'] as string;

  if (!initData) {
    return res.status(401).json({ error: 'Missing Telegram init data' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // В режиме разработки можно пропустить валидацию
  if (process.env.NODE_ENV === 'development' && initData === 'dev') {
    req.telegramUser = {
      id: 123456789,
      first_name: 'Dev User',
      username: 'devuser',
    };
    return next();
  }

  const user = validateTelegramWebAppData(initData, botToken);

  if (!user) {
    return res.status(401).json({ error: 'Invalid Telegram data' });
  }

  req.telegramUser = user;
  next();
}
