import { Router, Request, Response } from 'express';
import db from '../db/database';

const router = Router();

interface GalleryRow {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  created_at: string;
}

// Отримання списку елементів галереї (з опціональною фільтрацією за категорією)
router.get('/', (req: Request, res: Response): void => {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM gallery';
    const params: any[] = [];

    if (category && typeof category === 'string') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const items = db.prepare(query).all(...params) as GalleryRow[];

    res.json(items);
  } catch (error) {
    console.error('[Помилка отримання галереї]:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

export default router;
