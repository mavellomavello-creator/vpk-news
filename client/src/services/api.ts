const API_BASE = '/api';

export interface NewsItem {
  id: number;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role?: string;
  };
}

export interface NewsParams {
  search?: string;
  category?: string;
  sort?: string;
}

// Базовий обробник відповідей сервера
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || errorData.message || `Помилка сервера (HTTP ${response.status})`;
    throw new Error(message);
  }
  return response.json();
}

// Отримання каталогу новин із фільтрами та пошуком
export async function getNews(params?: NewsParams): Promise<NewsItem[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);
  if (params?.sort) query.set('sort', params.sort);
  const queryString = query.toString();
  const url = `${API_BASE}/news${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url);
  return handleResponse<NewsItem[]>(response);
}

// Отримання 10 головних новин для головної сторінки
export async function getTopNews(): Promise<NewsItem[]> {
  const response = await fetch(`${API_BASE}/news/top`);
  return handleResponse<NewsItem[]>(response);
}

// Отримання повної інформації про новину за ID
export async function getNewsById(id: number | string): Promise<NewsItem> {
  const response = await fetch(`${API_BASE}/news/${id}`);
  return handleResponse<NewsItem>(response);
}

// Створення новини (панель адміністратора)
export async function createNews(
  data: Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'author'>,
  token: string
): Promise<NewsItem> {
  const response = await fetch(`${API_BASE}/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<NewsItem>(response);
}

// Оновлення новини (панель адміністратора)
export async function updateNews(
  id: number | string,
  data: Partial<Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'author'>>,
  token: string
): Promise<NewsItem> {
  const response = await fetch(`${API_BASE}/news/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<NewsItem>(response);
}

// Видалення новини (панель адміністратора)
export async function deleteNews(id: number | string, token: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/news/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<{ message: string }>(response);
}

// Авторизація користувача
export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<AuthResponse>(response);
}

// Реєстрація нового користувача
export async function register(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<AuthResponse>(response);
}

// Отримання елементів фотогалереї
export async function getGallery(category?: string): Promise<GalleryItem[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const response = await fetch(`${API_BASE}/gallery${query}`);
  return handleResponse<GalleryItem[]>(response);
}

// Завантаження графічного файлу на сервер
export async function uploadImage(file: File, token: string): Promise<{ url: string; filename: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const response = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: base64,
            filename: file.name,
          }),
        });
        const result = await handleResponse<{ url: string; filename: string }>(response);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Не вдалося прочитати файл'));
    reader.readAsDataURL(file);
  });
}
