/**
 * Cloudflare Worker для автоматического сброса режима разработчика на LG телевизорах
 * 
 * Как использовать:
 * 1. Добавьте переменные окружения в панели управления Cloudflare Workers:
 *    - TOKEN_TV1, TOKEN_TV2, TOKEN_TV3 и т.д. с токенами сессий ваших телевизоров
 * 2. Настройте триггер по расписанию для автоматического запуска
 * 3. Или вызовите вручную через HTTP-запрос к вашему воркеру
 */

// Конфигурация
const CONFIG = {
  LG_RESET_URL: 'https://developer.lge.com/secure/ResetDevModeSession.dev',
  REQUEST_TIMEOUT: 10000, // 10 секунд
  TOKEN_PREFIX: 'TOKEN_TV',
  MIN_TOKEN_LENGTH: 10,
  VERSION: '1.1.0'
};

/**
 * @typedef {Object} TokenItem
 * @property {string} name - Имя переменной окружения
 * @property {string} token - Токен телевизора
 */

/**
 * @typedef {Object} ResetResult
 * @property {string} tv - Имя телевизора
 * @property {number} [status] - HTTP статус ответа
 * @property {string} [statusText] - Текст статуса ответа
 * @property {string} [error] - Сообщение об ошибке
 * @property {boolean} success - Флаг успешности операции
 * @property {string} timestamp - Временная метка операции в ISO формате
 */

/**
 * @typedef {Object} ResetSummary
 * @property {number} total - Общее количество телевизоров
 * @property {number} successful - Количество успешных сбросов
 * @property {number} failed - Количество неудачных сбросов
 * @property {string} timestamp - Временная метка завершения операций
 */

/**
 * @typedef {Object} ApiResponse
 * @property {ResetSummary} summary - Сводка результатов
 * @property {ResetResult[]} results - Детальные результаты для каждого телевизора
 */

export default {
  /**
   * Обработчик HTTP-запросов для ручного запуска сброса
   * @param {Request} request - Входящий HTTP-запрос
   * @param {Object} env - Переменные окружения воркера
   * @returns {Promise<Response>} JSON-ответ с результатами операций
   */
  async fetch(request, env) {
    try {
      // Добавляем поддержку CORS для браузерных запросов
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      // Обрабатываем OPTIONS запрос для CORS
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: corsHeaders
        });
      }

      const url = new URL(request.url);
      
      // Health check endpoint
      if (url.pathname === '/health') {
        const tokens = this.getTokensFromEnv(env);
        return new Response(JSON.stringify({
          status: 'healthy',
          version: CONFIG.VERSION,
          timestamp: new Date().toISOString(),
          config: {
            tokensConfigured: tokens.length,
            requestTimeout: CONFIG.REQUEST_TIMEOUT,
            lgResetUrl: CONFIG.LG_RESET_URL
          }
        }, null, 2), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Получаем все токены из переменных окружения
      const tokens = this.getTokensFromEnv(env);
      
      if (tokens.length === 0) {
        return new Response(JSON.stringify({
          error: 'Токены телевизоров не найдены в переменных окружения',
          message: `Убедитесь, что добавили переменные ${CONFIG.TOKEN_PREFIX}1, ${CONFIG.TOKEN_PREFIX}2 и т.д.`
        }, null, 2), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      
      // Выполняем сброс для всех телевизоров
      const results = await this.resetAllTVs(tokens);

      // Подсчитываем статистику
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      const response = {
        summary: {
          total: results.length,
          successful: successCount,
          failed: failureCount,
          timestamp: new Date().toISOString()
        },
        results: results
      };

      // Возвращаем результаты в формате JSON
      return new Response(JSON.stringify(response, null, 2), {
        status: successCount > 0 ? 200 : 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('Критическая ошибка в fetch handler:', error);
      return new Response(JSON.stringify({
        error: 'Внутренняя ошибка сервера',
        message: error.message,
        timestamp: new Date().toISOString()
      }, null, 2), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  },

  /**
   * Обработчик запланированных событий для автоматического запуска по расписанию
   * @param {Object} event - Событие планировщика
   * @param {Object} env - Переменные окружения воркера
   * @param {Object} ctx - Контекст выполнения
   * @returns {Promise<void>} Ничего не возвращает
   */
  async scheduled(event, env, ctx) {
    try {
      console.log(`Запланированное событие запущено в: ${event.scheduledTime}`);
      
      // Получаем все токены из переменных окружения
      const tokens = this.getTokensFromEnv(env);
      
      if (tokens.length === 0) {
        console.error('Токены телевизоров не найдены в переменных окружения');
        return;
      }
      
      // Выполняем сброс для всех телевизоров
      const results = await this.resetAllTVs(tokens);
      
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;
      
      console.log(`Результаты сброса: ${successCount} успешно, ${failureCount} неудачно`);
      console.log('Детальные результаты:', JSON.stringify(results, null, 2));
    } catch (error) {
      console.error('Критическая ошибка в scheduled handler:', error);
    }
  },

  /**
   * Получает все токены телевизоров из переменных окружения
   * @param {Object} env - Переменные окружения воркера
   * @returns {TokenItem[]} Массив токенов
   */
  getTokensFromEnv(env) {
    if (!env || typeof env !== 'object') {
      console.error('Переменные окружения не предоставлены');
      return [];
    }

    // Ищем все переменные окружения, начинающиеся с "TOKEN_TV"
    const tokenKeys = Object.keys(env).filter(key => key.startsWith(CONFIG.TOKEN_PREFIX));
    
    if (tokenKeys.length === 0) {
      console.warn(`Переменные ${CONFIG.TOKEN_PREFIX}* не найдены в окружении`);
      return [];
    }

    console.log(`Найдено ${tokenKeys.length} переменных токенов: ${tokenKeys.join(', ')}`);

    const tokens = tokenKeys
      .map(key => {
        const token = env[key];
        
        // Проверяем, что токен не пустой и имеет разумную длину
        if (!token || typeof token !== 'string') {
          console.warn(`Токен ${key} пустой или не является строкой`);
          return null;
        }

        if (token.length < CONFIG.MIN_TOKEN_LENGTH) {
          console.warn(`Токен ${key} слишком короткий (${token.length} символов, минимум ${CONFIG.MIN_TOKEN_LENGTH})`);
          return null;
        }

        // Базовая проверка формата токена (должен содержать буквы и цифры)
        if (!/^[a-zA-Z0-9._-]+$/.test(token)) {
          console.warn(`Токен ${key} содержит недопустимые символы`);
          return null;
        }

        return {
          name: key,
          token: token.trim()
        };
      })
      .filter(item => item !== null); // Исключаем невалидные токены

    console.log(`Валидных токенов: ${tokens.length}`);
    return tokens;
  },

  /**
   * Выполняет сброс режима разработчика для всех телевизоров
   * @param {TokenItem[]} tokenItems - Массив объектов с токенами
   * @returns {Promise<ResetResult[]>} Результаты операций для каждого телевизора
   */
  async resetAllTVs(tokenItems) {
    if (!tokenItems || tokenItems.length === 0) {
      console.log('Токены телевизоров не найдены');
      return [];
    }

    console.log(`Начинаем сброс режима разработчика для ${tokenItems.length} телевизор(ов)...`);

    // Создаем промисы для параллельного выполнения запросов
    const resetPromises = tokenItems.map(async (item) => {
      const url = `${CONFIG.LG_RESET_URL}?sessionToken=${item.token}`;
      
      try {
        console.log(`Сброс режима разработчика для ${item.name}...`);
        
        // Добавляем таймаут для запроса
        const response = await fetch(url, { 
          method: 'GET',
          signal: AbortSignal.timeout(CONFIG.REQUEST_TIMEOUT)
        });
        
        const result = {
          tv: item.name,
          status: response.status,
          statusText: response.statusText,
          success: response.status === 200,
          timestamp: new Date().toISOString()
        };

        console.log(`${item.name}: ${response.status} ${response.statusText}`);
        return result;
        
      } catch (error) {
        console.error(`Ошибка при сбросе ${item.name}:`, error.message);
        return {
          tv: item.name,
          error: error.message,
          success: false,
          timestamp: new Date().toISOString()
        };
      }
    });

    // Ждем завершения всех запросов параллельно
    const results = await Promise.allSettled(resetPromises);
    
    // Преобразуем результаты Promise.allSettled в нужный формат
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          tv: tokenItems[index].name,
          error: `Promise rejected: ${result.reason}`,
          success: false,
          timestamp: new Date().toISOString()
        };
      }
    });
  }
};
