import { OrderSchema } from '../../src/types/schemas';
import { sendTelegramMessage } from '../services/telegram';

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  SENDGRID_API_KEY: string;
  OWNER_EMAIL: string;
  SENDER_EMAIL: string;
}

export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    
    // 1. Validate incoming data via Zod
    const validationResult = OrderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.format()
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const order = validationResult.data;
    
    // 2. Generate random Order ID (date-based + random string)
    const orderId = order.id || `AP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = order.createdAt || new Date().toISOString();
    
    // 3. Process Cart Items & calculate standard total cost
    let computedStandardTotal = 0;
    let itemsTextList = '';
    let emailItemsTextList = '';
    
    order.items.forEach((item, index) => {
      const itemSum = item.price * item.count;
      computedStandardTotal += itemSum;
      itemsTextList += `${index + 1}. <b>${item.title}</b> (x${item.count}) - ${item.price} грн/од. (Сума: ${itemSum} грн)\n`;
      emailItemsTextList += `${index + 1}. ${item.title} (x${item.count}) - ${item.price} грн/од. (Сума: ${itemSum} грн)\n`;
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

    // 5. Build Email Body Text for Owner
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

    // 6. Send Telegram Notification (if config present)
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

    // 7. Send Email Notification via SendGrid (if config present)
    if (env.SENDGRID_API_KEY && env.OWNER_EMAIL) {
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

        if (!mailRes.ok) {
          console.error('SendGrid responded with error:', await mailRes.text());
        }
      } catch (err) {
        console.error('Failed to send email via SendGrid:', err);
      }
    } else {
      console.log('Email configuration missing or SendGrid deactivated. Email notification body:\n', emailBody);
    }
    
    // 8. Return success response
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
};
