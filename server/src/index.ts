import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import { initializeDatabase } from './db/database';
import { seedDatabase } from './db/seed';

import authRoutes from './routes/auth';
import newsRoutes from './routes/news';
import galleryRoutes from './routes/gallery';
import uploadRoutes, { uploadsDir } from './routes/upload';

// Ініціалізація бази даних та наповнення початковими записами
initializeDatabase();
seedDatabase();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Проміжне програмне забезпечення CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Обробка тіла запитів JSON з лімітом до 25 МБ для завантаження зображень
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Роздача завантажених медіафайлів
app.use('/uploads', express.static(uploadsDir));

// Маршрути REST API
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes);

// Роздача статичних файлів скомпільованого клієнта
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Перенаправлення маршрутів на index.html для Single Page Application (SPA)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`  ВПК-news — Сервер запущено`);
  console.log(`  Порт: ${PORT}`);
  console.log(`  Режим: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  API: http://localhost:${PORT}/api`);
  console.log(`  Завантаження: http://localhost:${PORT}/uploads`);
  console.log(`========================================\n`);
});

export default app;
