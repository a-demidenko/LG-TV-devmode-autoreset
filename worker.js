export default {
  async fetch(request, env) {
    const urls = [
      `https://developer.lge.com/secure/ResetDevModeSession.dev?sessionToken=${env.TOKEN_TV1}`, // My TV
      `https://developer.lge.com/secure/ResetDevModeSession.dev?sessionToken=${env.TOKEN_TV2}`  // mr. K TV
    ];

    let responses = [];

    for (const url of urls) {
      try {
        const response = await fetch(url, { method: 'GET' });
        responses.push({
          url,
          status: response.status,
          statusText: response.statusText
        });
      } catch (error) {
        responses.push({
          url,
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify(responses, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async scheduled(event, env, ctx) {
    console.log(`Scheduled event triggered at: ${event.scheduledTime}`);
    // Ваши действия, которые должны выполняться по расписанию
  },
};
