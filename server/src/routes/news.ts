import { Router, Request, Response } from 'express';
import db from '../db/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

interface NewsRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  author: string;
  created_at: string;
  updated_at: string;
}

function generateSlug(title: string): string {
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu',
    'я': 'ya'
  };

  const translit = (title || '')
    .toLowerCase()
    .split('')
    .map(c => cyrillicToLatin[c] !== undefined ? cyrillicToLatin[c] : c)
    .join('');

  const clean = translit.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const timestamp = Date.now().toString(36);
  return clean ? `${clean}-${timestamp}` : `news-${timestamp}`;
}

// Отримання списку новин із пошуком, фільтрацією та сортуванням
router.get('/', (req: Request, res: Response): void => {
  try {
    const { search, category, sort } = req.query;

    let query = 'SELECT * FROM news WHERE 1=1';
    const params: any[] = [];

    if (search && typeof search === 'string') {
      query += ' AND (title LIKE ? OR excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category && typeof category === 'string' && category !== 'Всі') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (sort === 'old' || sort === 'date_asc') {
      query += ' ORDER BY created_at ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const news = db.prepare(query).all(...params) as NewsRow[];

    res.json(news);
  } catch (error) {
    console.error('[Помилка отримання списку новин]:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера', message: 'Внутрішня помилка сервера' });
  }
});

// Отримання 10 головних новин порталу
router.get('/top', (_req: Request, res: Response): void => {
  try {
    const news = db.prepare(
      'SELECT * FROM news ORDER BY created_at DESC LIMIT 10'
    ).all() as NewsRow[];

    res.json(news);
  } catch (error) {
    console.error('[Помилка отримання топ новин]:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера', message: 'Внутрішня помилка сервера' });
  }
});

// Отримання окремої новини за ідентифікатором (ID)
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params;

    const news = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as NewsRow | undefined;

    if (!news) {
      res.status(404).json({ error: 'Новину не знайдено', message: 'Новину не знайдено' });
      return;
    }

    res.json(news);
  } catch (error) {
    console.error('[Помилка отримання новини за ID]:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера', message: 'Внутрішня помилка сервера' });
  }
});

// Створення нової новини (вимагає автентифікації адміністратора)
router.post('/', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const { title, slug, excerpt, content, category, image_url, author } = req.body;

    if (!title || !excerpt || !content || !category) {
      res.status(400).json({
        error: 'Обов\'язкові поля: заголовок (title), короткий опис (excerpt), зміст (content), категорія (category)',
        message: 'Обов\'язкові поля: заголовок, короткий опис, зміст, категорія'
      });
      return;
    }

    // Автоматична генерація slug на основі заголовка, якщо не вказано
    const finalSlug = (slug && slug.trim()) ? slug.trim() : generateSlug(title);

    const existingSlug = db.prepare('SELECT id FROM news WHERE slug = ?').get(finalSlug);
    if (existingSlug) {
      res.status(409).json({ error: 'Новина з таким slug вже існує', message: 'Новина з таким ідентифікатором вже існує' });
      return;
    }

    const now = new Date().toISOString();

    const result = db.prepare(`
      INSERT INTO news (title, slug, excerpt, content, category, image_url, author, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title.trim(),
      finalSlug,
      excerpt.trim(),
      content.trim(),
      category,
      image_url ? image_url.trim() : null,
      author ? author.trim() : 'Редакція',
      now,
      now
    );

    const newNews = db.prepare('SELECT * FROM news WHERE id = ?').get(result.lastInsertRowid) as NewsRow;

    res.status(201).json(newNews);
  } catch (error) {
    console.error('[Помилка створення новини]:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера', message: 'Внутрішня помилка сервера' });
  }
});

// Оновлення новини за ідентифікатором (вимагає прав адміністратора)
router.put('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, category, image_url, author } = req.body;

    const existingNews = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as NewsRow | undefined;
    if (!existingNews) {
      res.status(404).json({ error: 'Новину не знайдено', message: 'Новину не знайдено' });
      return;
    }

    let finalSlug = existingNews.slug;
    if (slug && slug.trim() && slug.trim() !== existingNews.slug) {
      const duplicateSlug = db.prepare('SELECT id FROM news WHERE slug = ? AND id != ?').get(slug.trim(), id);
      if (duplicateSlug) {
        res.status(409).json({ error: 'Новина з таким slug вже існує', message: 'Новина з таким ідентифікатором вже існує' });
        return;
      }
      finalSlug = slug.trim();
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE news SET
        title = ?,
        slug = ?,
        excerpt = ?,
        content = ?,
        category = ?,
        image_url = ?,
        author = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      title !== undefined ? title.trim() : existingNews.title,
      finalSlug,
      excerpt !== undefined ? excerpt.trim() : existingNews.excerpt,
      content !== undefined ? content.trim() : existingNews.content,
      category !== undefined ? category : existingNews.category,
      image_url !== undefined ? (image_url ? image_url.trim() : null) : existingNews.image_url,
      author !== undefined ? author.trim() : existingNews.author,
      now,
      id
    );

    const updatedNews = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as NewsRow;

    res.json(updatedNews);
  } catch (error) {
    console.error('[Помилка оновлення новини]:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера', message: 'Внутрішня помилка сервера' });
  }
});

// Видалення новини за ідентифікатором (вимагає прав адміністратора)
router.delete('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;

    const existingNews = db.prepare('SELECT id FROM news WHERE id = ?').get(id);
    if (!existingNews) {
      res.status(404).json({ error: 'Новину не знайдено', message: 'Новину не знайдено' });
      return;
    }

    db.prepare('DELETE FROM news WHERE id = ?').run(id);

    res.json({ message: 'Новину успішно видалено' });
  } catch (error) {
    console.error('[Помилка видалення новини]:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера', message: 'Внутрішня помилка сервера' });
  }
});

export default router;
