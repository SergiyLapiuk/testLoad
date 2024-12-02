import http from 'k6/http';
import { sleep, check } from 'k6';

// Оптимальні параметри тестування
export const options = {
    stages: [
        { duration: '20s', target: 10 }, // Плавний старт: досягти 10 користувачів за 20 секунд
        { duration: '1m30s', target: 30 }, // Основне навантаження: 30 користувачів стабільно протягом 1 хвилини 30 секунд
        { duration: '20s', target: 10 }, // Поступове зниження: повернення до 10 користувачів за 20 секунд
        { duration: '20s', target: 0 },  // Завершення: зниження до 0 користувачів за 20 секунд
    ],
};

export default function () {
    // URL для локальної і розгорнутої версії
    const localUrl = 'http://localhost:5101/api/Events/85';
    const remoteUrl = 'https://mapofactivitiesapi.onrender.com/api/Events/85';

    // Виберіть потрібний URL
    const isLocal = false; // Змініть на true, якщо тестуєте локальну версію
    const url = isLocal ? localUrl : remoteUrl;

    // Відправка запиту GET
    const res = http.get(url);

    // Перевірки відповіді
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has correct structure': (r) => {
            const json = r.json();
            return json.id === 85 && json.name !== undefined && json.type !== undefined;
        },
    });

    sleep(1); // Затримка 1 секунда між запитами
}
