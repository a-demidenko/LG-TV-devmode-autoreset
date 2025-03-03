/**
 * Cloudflare Worker для автоматического сброса режима разработчика на LG телевизорах
 * 
 * Как использовать:
 * 1. Добавьте переменные окружения в панели управления Cloudflare Workers:
 *    - TOKEN_TV1, TOKEN_TV2, TOKEN_TV3 и т.д. с токенами сессий ваших телевизоров
 * 2. Настройте триггер по расписанию для автоматического запуска
 * 3. Или вызовите вручную через HTTP-запрос к вашему воркеру
 */
export default {
  /**
   * Обработчик HTTP-запросов для ручного запуска сброса
   * @param {Request} request - Входящий HTTP-запрос
   * @param {Object} env - Переменные окружения воркера
   * @returns {Response} JSON-ответ с результатами операций
   */
  async fetch(request, env) {
    // Получаем все токены из переменных окружения
    const tokens = this.getTokensFromEnv(env);
    
    // Выполняем сброс для всех телевизоров
    const results = await this.resetAllTVs(tokens);

    // Возвращаем результаты в формате JSON
    return new Response(JSON.stringify(results, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  /**
   * Обработчик запланированных событий для автоматического запуска по расписанию
   * @param {Object} event - Событие планировщика
   * @param {Object} env - Переменные окружения воркера
   * @param {Object} ctx - Контекст выполнения
   */
  async scheduled(event, env, ctx) {
    console.log(`Запланированное событие запущено в: ${event.scheduledTime}`);
    
    // Получаем все токены из переменных окружения
    const tokens = this.getTokensFromEnv(env);
    
    // Выполняем сброс для всех телевизоров
    const results = await this.resetAllTVs(tokens);
    
    console.log('Результаты сброса:', JSON.stringify(results));
  },

  /**
   * Получает все токены телевизоров из переменных окружения
   * @param {Object} env - Переменные окружения воркера
   * @returns {Array} Массив токенов
   */
  getTokensFromEnv(env) {
    // Ищем все переменные окружения, начинающиеся с "TOKEN_TV"
    return Object.keys(env)
      .filter(key => key.startsWith('TOKEN_TV'))
      .map(key => ({
        name: key,
        token: env[key]
      }))
      .filter(item => item.token); // Исключаем пустые токены
  },

  /**
   * Выполняет сброс режима разработчика для всех телевизоров
   * @param {Array} tokenItems - Массив объектов с токенами
   * @returns {Array} Результаты операций для каждого телевизора
   */
  async resetAllTVs(tokenItems) {
    let results = [];

    for (const item of tokenItems) {
      const url = `https://developer.lge.com/secure/ResetDevModeSession.dev?sessionToken=${item.token}`;
      try {
        console.log(`Сброс режима разработчика для ${item.name}...`);
        const response = await fetch(url, { method: 'GET' });
        results.push({
          tv: item.name,
          status: response.status,
          statusText: response.statusText,
          success: response.status === 200
        });
      } catch (error) {
        console.error(`Ошибка при сбросе ${item.name}:`, error);
        results.push({
          tv: item.name,
          error: error.message,
          success: false
        });
      }
    }

    return results;
  }
};
