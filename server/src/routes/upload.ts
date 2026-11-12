import { Router, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Перевірка існування директорії для завантажень
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Завантаження зображення у форматі Base64 (тільки для адміністратора)
router.post('/', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const { image, filename: originalName } = req.body;

    if (!image || typeof image !== 'string') {
      res.status(400).json({ error: 'Зображення не надано або має невірний формат' });
      return;
    }

    // Перевірка формату Data URL: data:image/<type>;base64,<data>
    const matches = image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Невірний формат Data URL. Очікується data:image/...;base64,...' });
      return;
    }

    let ext = matches[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Обмеження розміру файлу до 20 МБ
    if (buffer.length > 20 * 1024 * 1024) {
      res.status(400).json({ error: 'Розмір файлу перевищує ліміт 20 МБ' });
      return;
    }

    const uniqueId = crypto.randomBytes(8).toString('hex');
    const safeName = (originalName || 'image')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);

    const filename = `${safeName}-${Date.now()}-${uniqueId}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    // Повернення відносного URL для відображення на клієнті
    res.status(201).json({
      url: `/uploads/${filename}`,
      filename,
      size: buffer.length
    });
  } catch (error) {
    console.error('[Помилка збереження файлу]:', error);
    res.status(500).json({ error: 'Помилка під час збереження файлу на сервері' });
  }
});

export default router;
export { uploadsDir };
