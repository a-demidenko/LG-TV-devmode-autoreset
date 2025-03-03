# LG TV Developer Mode Reset Worker | Сброс режима разработчика для телевизоров LG

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![LG webOS](https://img.shields.io/badge/LG-webOS-A50034?logo=lg&logoColor=white)](https://webostv.developer.lge.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A simple Cloudflare Worker that automatically resets the developer mode counter on NON-rooted LG TVs.

**Language**: [🇬🇧 English](#english) | [🇷🇺 Русский](#Русский)

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [How It Works](#how-it-works)

## English

### Overview

LG TVs have a developer mode that expires after a certain period. This Cloudflare Worker automates resetting the developer mode counter, preventing expiration. Useful for NON-rooted LG TVs running custom applications.

### Installation

1. Create a new Cloudflare Worker.
2. Copy the code from [src/worker.js](src/worker.js) into the worker.
3. Configure environment variables for your TV tokens.
4. Set a schedule for the worker to run (recommended: daily).

### Configuration

Add environment variables in this format:

- `TOKEN_TV1`: Session token for the first TV.
- `TOKEN_TV2`: Session token for the second TV.

Name these variables starting with `TOKEN_TV`.

In the worker settings, set when to execute the cron job.

Cron
```
0 0 * * *
```
Schedule: Every night

### How It Works

The worker:

1. Retrieves TV tokens from environment variables.
2. Sends a request to the LG developer mode reset URL for each token.
3. Processes requests in parallel.

Access the main functionality at:
```
https://developer.lge.com/secure/ResetDevMode.dev?sessionToken={YOUR_TOKEN}
```

---

## Русский

### Обзор

Телевизоры LG имеют режим разработчика, который истекает через определенный период. Этот Cloudflare Worker автоматизирует сброс счетчика режима разработчика, предотвращая его истечение. Полезно для НЕрутованных телевизоров LG с пользовательскими приложениями.

### Установка

1. Создайте новый Cloudflare Worker.
2. Скопируйте код из [src/worker.js](src/worker.js) в воркер.
3. Настройте переменные окружения для токенов ваших телевизоров.
4. Настройте расписание запуска воркера (рекомендуется: ежедневно).

### Настройка

Добавьте переменные окружения в следующем формате:

- `TOKEN_TV1`: Токен сессии для первого телевизора.
- `TOKEN_TV2`: Токен сессии для второго телевизора.

Назовите переменные, начиная с `TOKEN_TV`.

В настройках воркера установите расписание выполнения задания.

Cron
```
0 0 * * *
```
Расписание: Каждый день

### Принцип работы

Воркер:

1. Получает токены телевизоров из переменных окружения.
2. Отправляет запрос на URL сброса режима разработчика LG для каждого токена.
3. Обрабатывает запросы параллельно.

Основная функциональность доступна по адресу:
```
https://developer.lge.com/secure/ResetDevMode.dev?sessionToken={ВАШ_ТОКЕН}
```

---

Теперь логика более сжата и понятна, а ссылки на код добавлены. Также добавлены эмоджи для переключения языков.
