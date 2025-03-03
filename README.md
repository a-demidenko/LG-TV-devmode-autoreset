# LG TV Developer Mode Reset Worker | Сброс режима разработчика для телевизоров LG

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![LG webOS](https://img.shields.io/badge/LG-webOS-A50034?logo=lg&logoColor=white)](https://webostv.developer.lge.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A simple Cloudflare Worker that automatically resets the developer mode counter on rooted LG TVs.

**Language**: [English](#english) | [Русский](#russian)

## English

### Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup](#setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [How It Works](#how-it-works)

### Overview

LG TVs have a developer mode that expires after a certain period. This Cloudflare Worker automates the process of resetting the developer mode counter, preventing it from expiring. This is particularly useful for UNrooted LG TVs running custom applications.

### Features

- Automatically resets developer mode on LG TVs
- Can be triggered manually via HTTP request
- Runs on a schedule using Cloudflare Workers
- Supports multiple TVs simultaneously
- Minimal code with no dependencies

### Setup

1. Create a new Cloudflare Worker
2. Copy the code into the worker
3. Set up environment variables for your TV tokens
4. Configure the worker's trigger schedule (recommended: daily)

### Configuration

Add environment variables to your Cloudflare Worker with the following format:

- `TOKEN_TV1`: Your first TV session token
- `TOKEN_TV2`: Your second TV session token (if applicable)
- etc.

You can name these variables anything as long as they start with `TOKEN_TV`.

### Usage

The worker can be triggered in two ways:

1. **Automatic**: The worker runs on your configured schedule
2. **Manual**: Send an HTTP request to your worker's URL

### How It Works

The worker performs these simple steps:

1. Retrieves TV tokens from environment variables
2. For each token, sends a request to LG's developer mode reset URL
3. Processes requests in parallel for efficiency

The core functionality is performed by accessing:
```
https://developer.lge.com/secure/ResetDevMode.dev?sessionToken={YOUR_TOKEN}
```

## Russian

### Содержание

- [Обзор](#обзор)
- [Возможности](#возможности)
- [Установка](#установка)
- [Настройка](#настройка)
- [Использование](#использование)
- [Принцип работы](#принцип-работы)

### Обзор

Телевизоры LG имеют режим разработчика, который истекает через определенный период времени. Этот Cloudflare Worker автоматизирует процесс сброса счетчика режима разработчика, предотвращая его истечение. Это особенно полезно для НЕрутованных телевизоров LG, на которых запущены пользовательские приложения.

### Возможности

- Автоматический сброс режима разработчика на телевизорах LG
- Возможность ручного запуска через HTTP-запрос
- Работает по расписанию с использованием Cloudflare Workers
- Поддерживает несколько телевизоров одновременно
- Минимальный код без зависимостей

### Установка

1. Создайте новый Cloudflare Worker
2. Скопируйте код в воркер
3. Настройте переменные окружения для токенов ваших телевизоров
4. Настройте расписание запуска воркера (рекомендуется: ежедневно)

### Настройка

Добавьте переменные окружения в ваш Cloudflare Worker в следующем формате:

- `TOKEN_TV1`: Токен сессии для первого телевизора
- `TOKEN_TV2`: Токен сессии для второго телевизора (если применимо)
- и т.д.

Вы можете называть эти переменные как угодно, главное чтобы они начинались с `TOKEN_TV`.

### Использование

Воркер может быть запущен двумя способами:

1. **Автоматически**: Воркер запускается по настроенному расписанию
2. **Вручную**: Отправьте HTTP-запрос на URL вашего воркера

### Принцип работы

Воркер выполняет следующие простые шаги:

1. Получает токены телевизоров из переменных окружения
2. Для каждого токена отправляет запрос на URL сброса режима разработчика LG
3. Обрабатывает запросы параллельно для эффективности

Основная функциональность выполняется путем доступа к:
```
https://developer.lge.com/secure/ResetDevMode.dev?sessionToken={ВАШ_ТОКЕН}
```
