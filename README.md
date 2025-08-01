# LG TV Developer Mode Reset Worker | Сброс режима разработчика для телевизоров LG

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![LG webOS](https://img.shields.io/badge/LG-webOS-A50034?logo=lg&logoColor=white)](https://webostv.developer.lge.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A simple Cloudflare Worker that automatically resets the developer mode counter on NON-rooted LG TVs.

**Language**: [🇬🇧 English](#English) | [🇷🇺 Русский](#Русский)

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [How It Works](#how-it-works)

## English

### Overview

LG TVs have a developer mode that expires after a certain period. This Cloudflare Worker automates resetting the developer mode counter, preventing expiration. Useful for NON-rooted LG TVs running custom applications.

### Installation

1. Create a new [Cloudflare Worker](https://dash.cloudflare.com/) .
2. Copy the code from [src/worker.js](src/worker.js) into the worker.
3. Configure environment variables for your TV tokens. You can use the [dev-manager-desktop](https://github.com/webosbrew/dev-manager-desktop/releases/latest) program to obtain the tokens.
4. Set a schedule for the worker to run.

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
2. Validates tokens format and length.
3. Sends requests to the LG developer mode reset URL for each token in parallel.
4. Provides detailed results with timestamps and error handling.
5. Includes health check endpoint at `/health`.

### New Features (v1.1.0)

- **🚀 Parallel Processing**: Processes multiple TVs simultaneously for faster execution
- **⚡ Request Timeouts**: 10-second timeout for each request to prevent hanging
- **🔍 Enhanced Validation**: Better token validation with format checking
- **📊 Detailed Statistics**: Summary with success/failure counts and timestamps
- **🏥 Health Check**: `/health` endpoint for monitoring worker status
- **🌐 CORS Support**: Enables browser-based requests with proper CORS headers
- **📝 Better Logging**: More detailed logging for debugging and monitoring
- **⚙️ Configuration**: Centralized configuration constants for easy maintenance

### API Endpoints

**Main Reset Endpoint**: `GET /`
```json
{
  "summary": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "results": [
    {
      "tv": "TOKEN_TV1",
      "status": 200,
      "statusText": "OK",
      "success": true,
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

**Health Check**: `GET /health`
```json
{
  "status": "healthy",
  "version": "1.1.0",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "config": {
    "tokensConfigured": 2,
    "requestTimeout": 10000,
    "lgResetUrl": "https://developer.lge.com/secure/ResetDevModeSession.dev"
  }
}
```

Access the main functionality at:
```
https://developer.lge.com/secure/ResetDevMode.dev?sessionToken={YOUR_TOKEN}
```

---

## Русский

### Обзор

Телевизоры LG имеют режим разработчика, который истекает через определенный период. Этот Cloudflare Worker автоматизирует сброс счетчика режима разработчика, предотвращая его истечение. Полезно для НЕрутованных телевизоров LG с пользовательскими приложениями.

### Установка

1. Создайте новый [Cloudflare Worker](https://dash.cloudflare.com/) .
2. Скопируйте код из [src/worker.js](src/worker.js) в воркер.
3. Настройте переменные окружения для токенов ваших телевизоров. Вы можете использовать программу [dev-manager-desktop](https://github.com/webosbrew/dev-manager-desktop/releases/latest) для получения токенов.
4. Настройте расписание запуска воркера.

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
2. Проверяет формат и длину токенов.
3. Отправляет запросы на URL сброса режима разработчика LG для каждого токена параллельно.
4. Предоставляет детальные результаты с временными метками и обработкой ошибок.
5. Включает конечную точку проверки состояния по адресу `/health`.

### Новые возможности (v1.1.0)

- **🚀 Параллельная обработка**: Одновременная обработка нескольких телевизоров для быстрого выполнения
- **⚡ Таймауты запросов**: 10-секундный таймаут для каждого запроса предотвращает зависание
- **🔍 Улучшенная валидация**: Лучшая проверка токенов с проверкой формата
- **📊 Детальная статистика**: Сводка с количеством успехов/неудач и временными метками
- **🏥 Проверка здоровья**: Конечная точка `/health` для мониторинга состояния воркера
- **🌐 Поддержка CORS**: Включает браузерные запросы с правильными CORS-заголовками
- **📝 Лучшее логирование**: Более детальное логирование для отладки и мониторинга
- **⚙️ Конфигурация**: Централизованные константы конфигурации для легкого обслуживания

### API Конечные точки

**Основная точка сброса**: `GET /`
```json
{
  "summary": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "results": [
    {
      "tv": "TOKEN_TV1",
      "status": 200,
      "statusText": "OK",
      "success": true,
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

**Проверка здоровья**: `GET /health`
```json
{
  "status": "healthy",
  "version": "1.1.0",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "config": {
    "tokensConfigured": 2,
    "requestTimeout": 10000,
    "lgResetUrl": "https://developer.lge.com/secure/ResetDevModeSession.dev"
  }
}
```

Основная функциональность доступна по адресу:
```
https://developer.lge.com/secure/ResetDevMode.dev?sessionToken={ВАШ_ТОКЕН}
```
