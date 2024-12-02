import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
      { duration: '30s', target: 5 },  // Плавний старт: досягти 5 користувачів за 30 секунд
      { duration: '2m', target: 20 }, // Основний тест: 20 користувачів стабільно протягом 2 хвилин
      { duration: '30s', target: 5 },  // Зменшення навантаження: повернутися до 5 користувачів за 30 секунд
      { duration: '30s', target: 0 },  // Плавне завершення: знизити до 0 користувачів за 30 секунд
    ],
};

export default function () {
  // Локальний URL для тестування на вашій машині
  const localUrl = 'http://localhost:5101/api/Account/UserLogin'; // Змінити порт і шлях, якщо потрібно
  const remoteUrl = 'https://mapofactivitiesapi.onrender.com/api/Account/UserLogin'; // URL для тестування на Render

  // Виберіть потрібний URL (локальний або віддалений)
  const isLocal = false; // Змінити на false, якщо потрібно тестувати Render
  const url = isLocal ? localUrl : remoteUrl;

  const payload = JSON.stringify({
    email: 'sergiy.lapiuk777+test@gmail.com',
    password: 'Password777.',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  // Перевіряємо успішність запиту
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response contains token': (res) => res.json('token') !== undefined,
  });

  sleep(1); // Затримка в 1 секунду між запитами
}
