import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database';
import { JWT_SECRET } from '../middleware/auth';

const router = Router();

interface UserRow {
  id: number;
  username: string;
  password: string;
  role: string;
  created_at: string;
}

// Авторизація користувача (отримання JWT токена)
router.post('/login', (req: Request, res: Response): void => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Необхідно вказати логін та пароль' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as UserRow | undefined;

    if (!user) {
      res.status(401).json({ error: 'Невірний логін або пароль' });
      return;
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Невірний логін або пароль' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('[Помилка авторизації]:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

// Реєстрація нового користувача
router.post('/register', (req: Request, res: Response): void => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Необхідно вказати логін та пароль' });
      return;
    }

    if (username.length < 3) {
      res.status(400).json({ error: 'Логін повинен містити щонайменше 3 символи' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Пароль повинен містити щонайменше 6 символів' });
      return;
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);

    if (existingUser) {
      res.status(409).json({ error: 'Користувач з таким логіном вже існує' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = db.prepare(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
    ).run(username, hashedPassword, 'user');

    const token = jwt.sign(
      { id: result.lastInsertRowid, username, role: 'user' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.lastInsertRowid,
        username,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('[Помилка реєстрації]:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

export default router;
