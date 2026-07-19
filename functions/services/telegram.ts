export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export async function sendTelegramMessage(config: TelegramConfig, message: string): Promise<boolean> {
  const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}
