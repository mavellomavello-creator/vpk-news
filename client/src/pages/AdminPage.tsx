import { useState, useEffect, useCallback, useRef } from 'react';
import ZsuLogo from '../components/ZsuLogo';
import Tooltip from '../components/Tooltip';
import {
  login as apiLogin,
  register as apiRegister,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  uploadImage,
  NewsItem,
} from '../services/api';
import '../styles/pages/_admin.scss';

interface AuthUser {
  id: number;
  username: string;
}

interface NewsForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
}

const categoriesList = [
  'БПЛА',
  'Артилерія',
  'Морські дрони',
  'Бронетехніка',
  'РЕБ',
  'Ракетне озброєння',
  'Стрілецька зброя',
  'Загальне',
];

function AdminPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('vpk_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('vpk_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newsForm, setNewsForm] = useState<NewsForm>({
    title: '',
    excerpt: '',
    content: '',
    category: categoriesList[0],
    image_url: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const fetchNewsList = useCallback(async () => {
    try {
      setNewsLoading(true);
      setNewsError(null);
      const data = await getNews();
      setNewsList(data);
    } catch (err) {
      setNewsError(err instanceof Error ? err.message : 'Помилка завантаження');
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchNewsList();
    }
  }, [token, fetchNewsList]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const authFn = authMode === 'login' ? apiLogin : apiRegister;
      const result = await authFn(authForm.username, authForm.password);
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem('vpk_token', result.token);
      localStorage.setItem('vpk_user', JSON.stringify(result.user));
      setAuthForm({ username: '', password: '' });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Помилка авторизації');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vpk_token');
    localStorage.removeItem('vpk_user');
    setAuthForm({ username: '', password: '' });
    setShowPassword(false);
    setNewsList([]);
    setEditingId(null);
  };

  const handleNewsFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewsForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    // Перевірка розміру файлу (максимум 20 МБ)
    if (file.size > 20 * 1024 * 1024) {
      setFormError('Розмір зображення не повинен перевищувати 20 МБ');
      return;
    }

    try {
      setUploadingImage(true);
      setFormError(null);
      const result = await uploadImage(file, token);
      setNewsForm((prev) => ({ ...prev, image_url: result.url }));
      setFormSuccess('Зображення успішно завантажено на сервер!');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Помилка завантаження файлу');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setFormError(null);
    setFormSuccess(null);
    setFormLoading(true);

    try {
      if (!newsForm.title.trim() || !newsForm.excerpt.trim() || !newsForm.content.trim()) {
        throw new Error('Будь ласка, заповніть обов\'язкові поля: заголовок, короткий опис та зміст');
      }

      if (editingId) {
        await updateNews(editingId, newsForm, token);
        setFormSuccess('Новину успішно оновлено!');
        setEditingId(null);
      } else {
        await createNews(newsForm, token);
        setFormSuccess('Новину успішно створено та додано до бази даних!');
      }

      setNewsForm({
        title: '',
        excerpt: '',
        content: '',
        category: categoriesList[0],
        image_url: '',
      });
      fetchNewsList();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Помилка збереження новини');
    } finally {
      setFormLoading(false);
    }
  };

  const startEdit = (news: NewsItem) => {
    setEditingId(news.id);
    setNewsForm({
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      category: news.category,
      image_url: news.image_url || '',
    });
    setFormError(null);
    setFormSuccess(null);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewsForm({
      title: '',
      excerpt: '',
      content: '',
      category: categoriesList[0],
      image_url: '',
    });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await deleteNews(id, token);
      setDeleteConfirm(null);
      if (editingId === id) cancelEdit();
      fetchNewsList();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Помилка видалення');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (!token || !user) {
    return (
      <div className="admin-page">
        <div className="admin-page__auth-container">
          <div className="admin-page__auth-card">
            <div className="admin-page__auth-header">
              <ZsuLogo size={46} className="admin-page__auth-icon" />
              <h1 className="admin-page__auth-title">Адмін-панель</h1>
              <p className="admin-page__auth-subtitle">
                {authMode === 'login'
                  ? 'Увійдіть до системи управління контентом'
                  : 'Створіть новий обліковий запис адміністратора'}
              </p>
            </div>

            <div className="admin-page__auth-tabs">
              <button
                className={`admin-page__auth-tab ${
                  authMode === 'login' ? 'admin-page__auth-tab--active' : ''
                }`}
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                type="button"
              >
                Вхід
              </button>
              <button
                className={`admin-page__auth-tab ${
                  authMode === 'register' ? 'admin-page__auth-tab--active' : ''
                }`}
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                }}
                type="button"
              >
                Реєстрація
              </button>
            </div>

            {authError && (
              <div className="admin-page__auth-error">
                <span>⚠</span> {authError}
              </div>
            )}

            <form className="admin-page__auth-form" onSubmit={handleAuthSubmit}>
              <div className="admin-page__form-group">
                <label htmlFor="auth-username" className="admin-page__form-label">
                  Ім'я користувача
                </label>
                <input
                  type="text"
                  id="auth-username"
                  className="admin-page__form-input"
                  placeholder="Введіть логін..."
                  autoComplete="username"
                  value={authForm.username}
                  onChange={(e) =>
                    setAuthForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="admin-page__form-group">
                <label htmlFor="auth-password" className="admin-page__form-label">
                  Пароль
                </label>
                <div className="admin-page__password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="auth-password"
                    className="admin-page__form-input admin-page__password-input"
                    placeholder="••••••••••••"
                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                    value={authForm.password}
                    onChange={(e) =>
                      setAuthForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />
                  <Tooltip content={showPassword ? 'Приховати пароль' : 'Показати пароль'}>
                    <button
                      type="button"
                      className="admin-page__password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </Tooltip>
                </div>
              </div>
              <button
                type="submit"
                className="admin-page__auth-submit"
                disabled={authLoading}
              >
                {authLoading
                  ? 'Зачекайте...'
                  : authMode === 'login'
                  ? 'Увійти'
                  : 'Зареєструватися'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__container">
        <div className="admin-page__dashboard-header">
          <div className="admin-page__welcome">
            <h1 className="admin-page__dashboard-title">Панель управління ВПК</h1>
            <p className="admin-page__welcome-text">
              Авторизовано як: <strong>{user.username}</strong>
            </p>
          </div>
          <button
            className="admin-page__logout-btn"
            onClick={handleLogout}
            type="button"
          >
            Вийти з системи
          </button>
        </div>

        <section className="admin-page__create-section" ref={formRef}>
          <div className="admin-page__section-header-row">
            <h2 className="admin-page__section-title">
              {editingId ? `Редагування новини #${editingId}` : 'Додати нову публікацію'}
            </h2>
            {editingId && (
              <button
                type="button"
                className="admin-page__btn-cancel-edit"
                onClick={cancelEdit}
              >
                ✕ Скасувати редагування
              </button>
            )}
          </div>

          {formError && (
            <div className="admin-page__form-error">
              <span>⚠</span> {formError}
            </div>
          )}
          {formSuccess && (
            <div className="admin-page__form-success">
              <span>✓</span> {formSuccess}
            </div>
          )}

          <form className="admin-page__news-form" onSubmit={handleNewsSubmit}>
            <div className="admin-page__form-row">
              <div className="admin-page__form-group">
                <label htmlFor="news-title" className="admin-page__form-label">
                  Заголовок новини *
                </label>
                <input
                  type="text"
                  id="news-title"
                  name="title"
                  className="admin-page__form-input"
                  placeholder="Наприклад: Новітній морський дрон Sea Baby отримав нове озброєння"
                  value={newsForm.title}
                  onChange={handleNewsFormChange}
                  required
                />
              </div>
              <div className="admin-page__form-group">
                <label htmlFor="news-category" className="admin-page__form-label">
                  Категорія озброєння *
                </label>
                <select
                  id="news-category"
                  name="category"
                  className="admin-page__form-select"
                  value={newsForm.category}
                  onChange={handleNewsFormChange}
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-page__form-group">
              <label htmlFor="news-excerpt" className="admin-page__form-label">
                Короткий анонс (excerpt) *
              </label>
              <input
                type="text"
                id="news-excerpt"
                name="excerpt"
                className="admin-page__form-input"
                placeholder="Короткий огляд для відображення в картці на головній сторінці"
                value={newsForm.excerpt}
                onChange={handleNewsFormChange}
                required
              />
            </div>

            {/* Секція завантаження зображення або введення URL */}
            <div className="admin-page__form-group">
              <label className="admin-page__form-label">Ілюстрація до новини</label>

              <div className="admin-page__image-controls">
                {/* Вибір локального файлу */}
                <div className="admin-page__file-upload-box">
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="file-upload"
                    className="admin-page__file-input"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="admin-page__file-label">
                    📁 {uploadingImage ? 'Завантаження на сервер...' : 'Завантажити файл з комп\'ютера (PNG, JPG, WebP)'}
                  </label>
                </div>

                <div className="admin-page__or-divider">або вкажіть URL</div>

                {/* Поле для прямого введення посилання */}
                <input
                  type="text"
                  id="news-image"
                  name="image_url"
                  className="admin-page__form-input"
                  placeholder="https://example.com/photo.jpg або /images/news/..."
                  value={newsForm.image_url}
                  onChange={handleNewsFormChange}
                />
              </div>

              {/* Попередній перегляд зображення */}
              {newsForm.image_url && (
                <div className="admin-page__preview-box">
                  <span className="admin-page__preview-title">Попередній перегляд ілюстрації:</span>
                  <div className="admin-page__preview-img-wrapper">
                    <img
                      src={newsForm.image_url}
                      alt="Прев'ю новини"
                      className="admin-page__preview-img"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      className="admin-page__preview-remove-btn"
                      onClick={() => setNewsForm((prev) => ({ ...prev, image_url: '' }))}
                    >
                      ✕ Видалити ілюстрацію
                    </button>
                  </div>
                  <span className="admin-page__preview-url">{newsForm.image_url}</span>
                </div>
              )}
            </div>

            <div className="admin-page__form-group">
              <label htmlFor="news-content" className="admin-page__form-label">
                Повний зміст статті (content) *
              </label>
              <textarea
                id="news-content"
                name="content"
                className="admin-page__form-textarea"
                placeholder="Введіть повний текст публікації..."
                rows={10}
                value={newsForm.content}
                onChange={handleNewsFormChange}
                required
              ></textarea>
            </div>

            <div className="admin-page__form-actions">
              <button
                type="submit"
                className="admin-page__form-submit"
                disabled={formLoading || uploadingImage}
              >
                {formLoading
                  ? 'Збереження...'
                  : editingId
                  ? '💾 Зберегти зміни'
                  : '➕ Опублікувати новину'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="admin-page__btn-cancel-bottom"
                  onClick={cancelEdit}
                >
                  Скасувати
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-page__list-section">
          <div className="admin-page__section-header-row">
            <h2 className="admin-page__section-title">Список публікацій у базі даних</h2>
            <Tooltip content="Оновити список новин">
              <button
                type="button"
                className="admin-page__btn-refresh"
                onClick={fetchNewsList}
              >
                🔄 Оновити
              </button>
            </Tooltip>
          </div>

          {newsLoading && (
            <div className="admin-page__loading">
              <div className="admin-page__spinner"></div>
              <p>Оновлення списку новин...</p>
            </div>
          )}

          {newsError && (
            <div className="admin-page__form-error">
              <span>⚠</span> {newsError}
            </div>
          )}

          {!newsLoading && !newsError && newsList.length === 0 && (
            <div className="admin-page__empty">
              <p>Новин поки немає</p>
            </div>
          )}

          {!newsLoading && !newsError && newsList.length > 0 && (
            <div className="admin-page__table-wrapper">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ілюстрація</th>
                    <th>Заголовок</th>
                    <th>Категорія</th>
                    <th>Дата</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {newsList.map((news) => (
                    <tr key={news.id} className={editingId === news.id ? 'admin-page__row--editing' : ''}>
                      <td><strong>#{news.id}</strong></td>
                      <td>
                        {news.image_url ? (
                          <img
                            src={news.image_url}
                            alt=""
                            className="admin-page__thumb"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="admin-page__thumb-empty">📰</span>
                        )}
                      </td>
                      <td className="admin-page__table-title">{news.title}</td>
                      <td>
                        <span className="admin-page__table-category">{news.category}</span>
                      </td>
                      <td>{formatDate(news.created_at)}</td>
                      <td className="admin-page__table-actions">
                        <div className="admin-page__action-buttons">
                          <button
                            className="admin-page__btn-edit"
                            onClick={() => startEdit(news)}
                            type="button"
                          >
                            ✏ Редагувати
                          </button>
                          {deleteConfirm === news.id ? (
                            <div className="admin-page__delete-confirm">
                              <span>Видалити?</span>
                              <button
                                className="admin-page__btn-confirm-yes"
                                onClick={() => handleDelete(news.id)}
                                type="button"
                              >
                                Так
                              </button>
                              <button
                                className="admin-page__btn-confirm-no"
                                onClick={() => setDeleteConfirm(null)}
                                type="button"
                              >
                                Ні
                              </button>
                            </div>
                          ) : (
                            <button
                              className="admin-page__btn-delete"
                              onClick={() => setDeleteConfirm(news.id)}
                              type="button"
                            >
                              🗑 Видалити
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminPage;
