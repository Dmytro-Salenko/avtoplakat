import { OrderSchema } from './types/schemas';
import { sendTelegramMessage } from '../functions/services/telegram';

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  SENDGRID_API_KEY: string;
  OWNER_EMAIL: string;
  SENDER_EMAIL: string;
  ASSETS: {
    fetch: typeof fetch;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Route POST /api/order to order API logic
    if (url.pathname === '/api/order' && request.method === 'POST') {
      console.log('[ORDER API] Request received:', request.method, url.pathname);
      try {
        const body = await request.json();
        console.log('[ORDER API] JSON parsed successfully');
        
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
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        console.log('[ORDER API] Validation passed');
        const order = validationResult.data;
        
        // 2. Generate random Order ID
        const orderId = order.id || `AP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const createdAt = order.createdAt || new Date().toISOString();
        
        // 3. Process Cart Items
        let computedStandardTotal = 0;
        let itemsTextList = '';
        let emailItemsTextList = '';
        
        order.items.forEach((item, index) => {
          const qty = item.quantity;
          const itemSum = item.price * qty;
          computedStandardTotal += itemSum;
          itemsTextList += `${index + 1}. <b>${item.title}</b>\n   Файл: <code>${item.originalFilename}</code> | К-ть: ${qty} | Ціна: ${item.price} грн (Сума: ${itemSum} грн)\n`;
          emailItemsTextList += `${index + 1}. Назва товару: ${item.title}\n   Оригінальний файл: ${item.originalFilename}\n   Кількість: ${qty}\n   Ціна: ${item.price} грн/од. (Сума: ${itemSum} грн)\n\n`;
        });

        const paymentMethodText = order.payment.paymentMethod === 'invoiceWithVat' ? 'Рахунок з ПДВ' : 'Оплата на картку';

        // 4. Build Telegram Notification Message
        let telegramMsg = `🇺🇦 <b>НОВЕ ЗАМОВЛЕННЯ #${orderId}</b>\n`;
        telegramMsg += `📅 Дата: ${new Date(createdAt).toLocaleString('uk-UA')}\n\n`;
        
        telegramMsg += `👤 <b>Клієнт:</b>\n`;
        telegramMsg += `   Ім'я: ${order.clientName}\n`;
        telegramMsg += `   Телефон: ${order.clientPhone}\n`;
        telegramMsg += `   Email: ${order.clientEmail}\n\n`;
        
        telegramMsg += `📦 <b>Товари у кошику:</b>\n${itemsTextList}\n`;
        telegramMsg += `💵 <b>Загальна вартість:</b> ${computedStandardTotal} грн\n\n`;
        telegramMsg += `🚚 <b>Доставка (Нова пошта):</b>\n`;
        telegramMsg += `   Місто: ${order.delivery.cityName}\n`;
        telegramMsg += `   Відділення: ${order.delivery.warehouseName}\n\n`;
        telegramMsg += `💳 <b>Спосіб оплати:</b> ${paymentMethodText}\n`;
        
        if (order.comment) {
          telegramMsg += `\n💬 <b>Коментар:</b> ${order.comment}\n`;
        }

        // 5. Build Email Body Text
        let emailBody = `НОВЕ ЗАМОВЛЕННЯ #${orderId}\n`;
        emailBody += `Дата та час: ${new Date(createdAt).toLocaleString('uk-UA')}\n\n`;
        emailBody += `Клієнт:\n`;
        emailBody += `- ФІО: ${order.clientName}\n`;
        emailBody += `- Телефон: ${order.clientPhone}\n`;
        emailBody += `- Email: ${order.clientEmail}\n\n`;
        emailBody += `Товари у замовленні:\n${emailItemsTextList}\n`;
        emailBody += `Загальна сума: ${computedStandardTotal} грн\n\n`;
        emailBody += `Доставка:\n`;
        emailBody += `- Населений пункт: ${order.delivery.cityName}\n`;
        emailBody += `- Відділення Нової пошти: ${order.delivery.warehouseName}\n\n`;
        emailBody += `Спосіб оплати: ${paymentMethodText}\n`;
        
        if (order.comment) {
          emailBody += `\nКоментар замовника: ${order.comment}\n`;
        }

        // 6. Send Telegram Notification
        if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
          try {
            await sendTelegramMessage({
              botToken: env.TELEGRAM_BOT_TOKEN,
              chatId: env.TELEGRAM_CHAT_ID
            }, telegramMsg);
          } catch (err) {
            console.error('Failed to send Telegram message:', err);
          }
        }

        // 7. Send Email Notification via SendGrid
        console.log('[ORDER API] OWNER_EMAIL configured:', Boolean(env.OWNER_EMAIL));

        if (env.SENDGRID_API_KEY && env.OWNER_EMAIL) {
          console.log('[ORDER API] Mail API request started (SendGrid)');
          try {
            const mailPayload = {
              personalizations: [{
                to: [{ email: env.OWNER_EMAIL }]
              }],
              from: { email: env.SENDER_EMAIL || 'noreply@avtoplakat.com.ua' },
              subject: `Нове замовлення #${orderId} - AVTOPLAKAT`,
              content: [{
                type: 'text/plain',
                value: emailBody
              }]
            };

            const mailRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(mailPayload)
            });

            console.log('[ORDER API] Mail API response status:', mailRes.status);

            if (!mailRes.ok) {
              const errorText = await mailRes.text();
              console.error('[ORDER API] SendGrid responded with error:', mailRes.status, errorText);
              return new Response(JSON.stringify({
                success: false,
                stage: 'email_delivery',
                error: 'SendGrid email delivery failed',
                mailStatusCode: mailRes.status,
                mailErrorDetails: errorText
              }), {
                status: mailRes.status >= 400 && mailRes.status < 600 ? mailRes.status : 502,
                headers: { 'Content-Type': 'application/json' }
              });
            }
          } catch (err: any) {
            console.error('[ORDER API] Failed to send email via SendGrid:', err);
            return new Response(JSON.stringify({
              success: false,
              stage: 'email_delivery',
              error: 'Mail service request failed',
              details: err.message
            }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else {
          console.log('[ORDER API] Email configuration missing (SENDGRID_API_KEY or OWNER_EMAIL missing).');
        }

        console.log('[ORDER API] Order completed successfully:', orderId);
        
        return new Response(JSON.stringify({
          success: true,
          orderId
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      } catch (err: any) {
        console.error('Order API handler failed:', err);
        return new Response(JSON.stringify({
          success: false,
          error: 'Internal server error',
          details: err.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Serve static assets from `./dist` for all other requests
    return env.ASSETS.fetch(request);
  }
};
