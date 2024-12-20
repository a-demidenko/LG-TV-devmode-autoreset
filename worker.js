export default {
  async fetch(request) {
    const urls = [
      "https://developer.lge.com/secure/ResetDevModeSession.dev?sessionToken=8766a6c557282bb6ec2b7a3465be7b0d489d73a5874184f0928acc29f9658640",
      "https://developer.lge.com/secure/ResetDevModeSession.dev?sessionToken=0711407d35ff943c161c001a2c27f64ed78aded0e8898fbd2f9013c468a3ed62"
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
  }
};


