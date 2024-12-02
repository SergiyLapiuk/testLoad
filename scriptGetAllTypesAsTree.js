import http from 'k6/http';
import { sleep, check } from 'k6';

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
    const localUrl = 'http://localhost:5101/api/Types/GetAllTypesAsTree';
    const remoteUrl = 'https://mapofactivitiesapi.onrender.com/api/Types/GetAllTypesAsTree';

    // Вибір між локальним і віддаленим тестуванням
    const isLocal = false; // Змініть на true для тестування локальної версії
    const url = isLocal ? localUrl : remoteUrl;

    // Виконання запиту GET
    const res = http.get(url);

    // Перевірки відповіді
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response is an array': (r) => Array.isArray(r.json()),
        'response contains root types': (r) => {
            const json = r.json();
            return json.every((type) => type.parentTypeId === 0);
        },
        'response types have children': (r) => {
            const json = r.json();
            return json.every((type) => type.children !== undefined);
        },
    });

    sleep(1); // Затримка 1 секунда між запитами
}