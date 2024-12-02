import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '20s', target: 10 }, // Плавний старт
        { duration: '1m', target: 30 },  // Основне навантаження
        { duration: '20s', target: 10 }, // Зниження навантаження
        { duration: '20s', target: 0 },  // Завершення
    ],
};

export default function () {
    // URL для локальної і віддаленої версії
    const localUrl = 'http://localhost:5101/api/Complaints/event-complaint';
    const remoteUrl = 'https://mapofactivitiesapi.onrender.com/api/Complaints/event-complaint';

    // Вибір між локальним і віддаленим тестуванням
    const isLocal =  true; // Змініть на true для тестування локальної версії
    const url = isLocal ? localUrl : remoteUrl;

    // Дані скарги
    const payload = JSON.stringify({
        authorId: 23, // ID користувача, який подає скаргу
        header: 'Нецензурна лексика',
        description: 'Ця подія не відповідає вимогам платформи.',
        eventId: 154, // ID події, на яку подається скарга
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Виконання запиту POST
    const res = http.post(url, payload, params);

    // Перевірки відповіді
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response is empty or contains expected status': (r) => {
            if (r.body === '') {
                return true; // API повернуло порожню відповідь
            }
            const json = r.json();
            return json && json.status === 'Очікується';
        },
    });

    sleep(1); // Затримка 1 секунда між запитами
}
