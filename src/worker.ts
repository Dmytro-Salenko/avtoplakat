import { OrderSchema } from './types/schemas';

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  ASSETS: {
    fetch: typeof fetch;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Route POST /api/order to order API logic
    if (url.pathname === '/api/order' && request.method === 'POST') {
      console.log('[ORDER API] Order request received');
      try {
        let body;
        try {
          body = await request.json();
        } catch (e) {
          console.error('[ORDER API] Failed to parse request JSON');
          return new Response(JSON.stringify({
            success: false,
            stage: 'parsing',
            error: 'Invalid JSON payload'
          }), {
            status: 400,
            headers: { "Content-Type": "application/json; charset=utf-8" }
          });
        }
        
        // 1. Validate incoming data via Zod
        const validationResult = OrderSchema.safeParse(body);
        
        if (!validationResult.success) {
          const missingFields: string[] = [];
          const invalidFields: string[] = [];

          validationResult.error.issues.forEach(issue => {
            const path = issue.path.join('.');
            if (issue.code === 'invalid_type' && ((issue as any).received === 'undefined' || (issue as any).received === 'null')) {
              missingFields.push(path);
            } else {
              invalidFields.push(path);
            }
          });

          console.log('[ORDER API] Validation failed:', { missingFields, invalidFields });

          return new Response(JSON.stringify({
            success: false,
            stage: 'validation',
            error: 'Validation failed',
            missingFields,
            invalidFields,
            details: validationResult.error.format()
          }), {
            status: 400,
            headers: { "Content-Type": "application/json; charset=utf-8" }
          });
        }
        
        console.log('[ORDER API] Validation passed');
        const order = validationResult.data;
        
        // 2. Check Telegram Bot Configuration
        if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
          console.error('[ORDER API] Telegram environment variables missing');
          return new Response(JSON.stringify({
            success: false,
            stage: 'telegram',
            error: 'Telegram configuration is missing'
          }), {
            status: 500,
            headers: { "Content-Type": "application/json; charset=utf-8" }
          });
        }

        // 3. Process Cart Items and format Telegram Markdown Message
        let itemsFormattedText = '';
        order.items.forEach((item, index) => {
          if (index > 0) {
            itemsFormattedText += '\n━━━━━━━━━━━━━━\n\n';
          }
          itemsFormattedText += `📦 *${item.title}*\n`;
          itemsFormattedText += `Файл: \`${item.originalFilename}\`\n`;
          itemsFormattedText += `Кількість: ${item.quantity}\n`;
          itemsFormattedText += `Ціна: ${item.price} грн`;
        });

        const paymentMethodText = order.payment.paymentMethod === 'invoiceWithVat' ? 'Рахунок з ПДВ' : 'Оплата на картку';
        const commentText = order.comment && order.comment.trim() ? order.comment.trim() : '—';

        let telegramMessage = `🛒 *Нове замовлення*\n\n`;
        telegramMessage += `👤 *Ім'я:* ${order.clientName}\n`;
        telegramMessage += `📞 *Телефон:* ${order.clientPhone}\n`;
        telegramMessage += `📧 *Email:* ${order.clientEmail}\n\n`;
        telegramMessage += `🚚 *Доставка*\n`;
        telegramMessage += `Місто: ${order.delivery.cityName}\n`;
        telegramMessage += `Відділення: ${order.delivery.warehouseName}\n\n`;
        telegramMessage += `💳 *Оплата:*\n${paymentMethodText}\n\n`;
        telegramMessage += `━━━━━━━━━━━━━━\n\n`;
        telegramMessage += `${itemsFormattedText}\n\n`;
        telegramMessage += `━━━━━━━━━━━━━━\n\n`;
        telegramMessage += `💰 *Разом:* ${order.totalCost} грн\n\n`;
        telegramMessage += `📝 *Коментар:*\n${commentText}`;

        // 4. Send Message via Telegram Bot API
        console.log('[ORDER API] Telegram request started');
        try {
          const tgRes = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: env.TELEGRAM_CHAT_ID,
              text: telegramMessage,
              parse_mode: 'Markdown'
            })
          });

          const tgData: any = await tgRes.json().catch(() => null);
          console.log(`[ORDER API] Telegram response status: ${tgRes.status}`);

          if (!tgRes.ok || !tgData?.ok) {
            const errorDesc = tgData?.description || `Telegram API status ${tgRes.status}`;
            console.error('[ORDER API] Telegram send failed:', errorDesc);
            return new Response(JSON.stringify({
              success: false,
              stage: 'telegram',
              error: errorDesc
            }), {
              status: tgRes.status >= 400 && tgRes.status < 600 ? tgRes.status : 500,
              headers: { "Content-Type": "application/json; charset=utf-8" }
            });
          }

          console.log('[ORDER API] Order notification delivered to Telegram successfully');
          return new Response(JSON.stringify({
            success: true
          }), {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8" }
          });

        } catch (err: any) {
          console.error('[ORDER API] Telegram fetch exception:', err);
          return new Response(JSON.stringify({
            success: false,
            stage: 'telegram',
            error: err.message || 'Failed to communicate with Telegram API'
          }), {
            status: 500,
            headers: { "Content-Type": "application/json; charset=utf-8" }
          });
        }

      } catch (err: any) {
        console.error('[ORDER API] Internal server error:', err);
        return new Response(JSON.stringify({
          success: false,
          stage: 'server',
          error: 'Internal server error',
          details: err.message
        }), {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }
    }

    // Serve static assets from `./dist` for all other requests
    return env.ASSETS.fetch(request);
  }
};
