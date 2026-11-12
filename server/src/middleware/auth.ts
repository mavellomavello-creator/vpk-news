import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Секретний ключ для підпису та верифікації JWT-токенів
const JWT_SECRET = process.env.JWT_SECRET || 'vpk-news-portal-secret-key-2024';

export interface AuthPayload {
  id: number;
  username: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// Проміжний обробник перевірки JWT-автентифікації користувача
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Токен авторизації не надано' });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: 'Невірний формат токена. Використовуйте: Bearer <token>' });
    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Невірний або прострочений токен' });
    return;
  }
}

// Проміжний обробник перевірки прав адміністратора
export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Необхідна авторизація' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Доступ заборонено. Потрібні права адміністратора' });
    return;
  }

  next();
}

export { JWT_SECRET };
