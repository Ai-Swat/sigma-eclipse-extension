// Utility for sending messages to extension

export function sendMessageToExtension(message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    } else {
      reject(new Error('Chrome runtime not available'));
    }
  });
}

