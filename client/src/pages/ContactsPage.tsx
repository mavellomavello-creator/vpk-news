import { useState } from 'react';
import '../styles/pages/_contacts.scss';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function ContactsPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      alert('Будь ласка, заповніть усі поля форми.');
      return;
    }
    alert(
      `Дякуємо, ${form.name}! Ваше повідомлення надіслано. Ми зв'яжемося з вами найближчим часом.`
    );
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contacts-page">
      <section className="contacts-page__hero">
        <div className="contacts-page__container">
          <h1 className="contacts-page__title">Контакти</h1>
          <p className="contacts-page__subtitle">
            Зв'яжіться з нами для отримання додаткової інформації
          </p>
        </div>
      </section>

      <section className="contacts-page__content">
        <div className="contacts-page__container">
          <div className="contacts-page__info-cards">
            <div className="contacts-page__info-card">
              <span className="contacts-page__info-icon">📧</span>
              <h3 className="contacts-page__info-title">Email</h3>
              <p className="contacts-page__info-text">vpk.news@example.com</p>
              <p className="contacts-page__info-detail">Відповідаємо протягом 24 годин</p>
            </div>
            <div className="contacts-page__info-card">
              <span className="contacts-page__info-icon">📞</span>
              <h3 className="contacts-page__info-title">Телефон</h3>
              <p className="contacts-page__info-text">+380 44 123-45-67</p>
              <p className="contacts-page__info-detail">Пн-Пт: 9:00 - 18:00</p>
            </div>
            <div className="contacts-page__info-card">
              <span className="contacts-page__info-icon">📍</span>
              <h3 className="contacts-page__info-title">Адреса</h3>
              <p className="contacts-page__info-text">
                вулиця Князів Острозьких, 45/1
              </p>
              <p className="contacts-page__info-detail">Київ, 01011, Україна</p>
            </div>
          </div>

          <div className="contacts-page__main">
            <div className="contacts-page__form-section">
              <h2 className="contacts-page__form-title">Напишіть нам</h2>
              <form className="contacts-page__form" onSubmit={handleSubmit}>
                <div className="contacts-page__form-group">
                  <label htmlFor="contact-name" className="contacts-page__form-label">
                    Ваше ім'я
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    className="contacts-page__form-input"
                    placeholder="Введіть ваше ім'я"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contacts-page__form-group">
                  <label htmlFor="contact-email" className="contacts-page__form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    className="contacts-page__form-input"
                    placeholder="Введіть ваш email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contacts-page__form-group">
                  <label htmlFor="contact-subject" className="contacts-page__form-label">
                    Тема
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    className="contacts-page__form-input"
                    placeholder="Тема повідомлення"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contacts-page__form-group">
                  <label htmlFor="contact-message" className="contacts-page__form-label">
                    Повідомлення
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="contacts-page__form-textarea"
                    placeholder="Введіть ваше повідомлення"
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="contacts-page__form-submit">
                  Надіслати повідомлення
                </button>
              </form>
            </div>

            <div className="contacts-page__map-section">
              <h2 className="contacts-page__map-title">Наше розташування</h2>
              <div className="contacts-page__map-wrapper">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.5!2d30.5234!3d50.4371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0LLRg9C70LjRhtGPINCa0L3Rj9C30ZbQsiDQntGB0YLRgNC-0LfRjNC60LjRhSwgNDUvMSwg0JrQuNGX0LI!5e0!3m2!1suk!2sua!4v1700000000000!5m2!1suk!2sua"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Розташування офісу"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactsPage;
