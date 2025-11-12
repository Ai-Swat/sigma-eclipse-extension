// Handler for translation operations

export async function handleTranslation(payload: any, tabId?: number): Promise<any> {
  try {
    const { text, targetLanguage } = payload;

    if (!text || !targetLanguage) {
      throw new Error('Missing text or target language');
    }

    // Call LlamaCpp API for translation with streaming
    const LLAMACPP_URL = 'http://localhost:10345';

    const response = await fetch(`${LLAMACPP_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'local-model',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text to ${targetLanguage}. Provide ONLY the translation without any additional comments, explanations, or formatting. Keep the same tone and style as the original.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 2048,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`LlamaCpp API error: ${response.status}`);
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullTranslation = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullTranslation += content;

                // Send chunk to content script
                if (tabId) {
                  chrome.tabs
                    .sendMessage(tabId, {
                      type: 'TRANSLATION_CHUNK',
                      chunk: content,
                      fullText: fullTranslation,
                    })
                    .catch(() => {
                      // Ignore errors if content script not ready
                    });
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    }

    return {
      success: true,
      translation: fullTranslation.trim(),
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Translation failed',
    };
  }
}
