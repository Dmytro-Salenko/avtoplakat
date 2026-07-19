import { OrderSchema } from '../../src/types/schemas';
import { sendTelegramMessage } from '../services/telegram';
import { createMonobankInvoice } from '../services/monobank';

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  PAYMENT_API_KEY: string;
  PAYMENT_REDIRECT_URL: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
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
    
    order.items.forEach((item, index) => {
      if (item.isCustom) {
        itemsTextList += `${index + 1}. <b>${item.title}</b> (x${item.count}) - <i>Нестандартний варіант</i>\n`;
        itemsTextList += `   └ Вимоги: ${item.customRequirements}\n`;
      } else {
        const itemSum = item.price * item.count;
        computedStandardTotal += itemSum;
        itemsTextList += `${index + 1}. <b>${item.title}</b> (x${item.count}) - ${item.price} грн/од. (Сума: ${itemSum} грн)\n`;
      }
    });

    // 4. Decide on Payment & redirect
    let paymentLink = null;
    let paymentStatus = 'pending';
    let paymentProviderText = 'None';
    
    if (order.payment.paymentMethod === 'card' && !order.hasCustomItems) {
      // Create Monobank Invoice
      const monoInvoice = await createMonobankInvoice({
        apiKey: env.PAYMENT_API_KEY,
        redirectUrl: env.PAYMENT_REDIRECT_URL || 'https://avtoplakat.com.ua/thank-you'
      }, orderId, computedStandardTotal);
      
      if (monoInvoice) {
        paymentLink = monoInvoice.pageUrl;
        paymentStatus = 'awaitingPayment';
        paymentProviderText = 'Monobank';
      }
    } else if (order.payment.paymentMethod === 'invoiceWithVat') {
      paymentStatus = 'pending';
      paymentProviderText = 'InvoiceWithVat';
    } else {
      paymentStatus = 'pending';
      paymentProviderText = 'ManualConfirmation';
    }

    // 5. Build Telegram Notification Message
    let telegramMsg = `🇺🇦 <b>НОВЕ ЗАМОВЛЕННЯ #${orderId}</b>\n`;
    telegramMsg += `📅 Дата: ${new Date(createdAt).toLocaleString('uk-UA')}\n\n`;
    
    telegramMsg += `👤 <b>Клієнт:</b>\n`;
    telegramMsg += `   Ім'я: ${order.clientName}\n`;
    telegramMsg += `   Телефон: ${order.clientPhone}\n`;
    telegramMsg += `   Email: ${order.clientEmail}\n\n`;
    
    telegramMsg += `📦 <b>Товари у кошику:</b>\n${itemsTextList}\n`;
    
    if (order.hasCustomItems) {
      telegramMsg += `⚠️ <b>Містить індивідуальні вимоги!</b>\n`;
      telegramMsg += `   Стандартна сума до розрахунку: ${computedStandardTotal} грн (нестандартні позиції прораховуються вручну)\n\n`;
    } else {
      telegramMsg += `💵 <b>Загальна вартість:</b> ${computedStandardTotal} грн\n\n`;
    }
    
    telegramMsg += `🚚 <b>Доставка:</b>\n`;
    telegramMsg += `   Тип: ${order.delivery.type === 'parcel-locker' ? 'Поштомат' : 'Відділення'}\n`;
    telegramMsg += `   Місто: ${order.delivery.cityName}\n`;
    telegramMsg += `   Адреса: ${order.delivery.warehouseName}\n`;
    
    const recName = order.delivery.recipientName;
    const recPhone = order.delivery.recipientPhone;
    if (recName || recPhone) {
      telegramMsg += `   Отримувач: ${recName || 'не вказано'} (тел: ${recPhone || 'не вказано'})\n`;
    }
    telegramMsg += `\n`;
    
    telegramMsg += `💳 <b>Спосіб оплати:</b>\n`;
    if (order.payment.paymentMethod === 'invoiceWithVat' && order.vatRequest) {
      telegramMsg += `   Рахунок з ПДВ\n`;
      telegramMsg += `   🏢 Компанія: ${order.vatRequest.companyName}\n`;
      telegramMsg += `   🔢 Код ЄДРПОУ/РНОКПП: ${order.vatRequest.taxId}\n`;
      telegramMsg += `   🏠 Юр. адреса: ${order.vatRequest.legalAddress}\n`;
      telegramMsg += `   ✉️ Email для рахунку: ${order.vatRequest.invoiceEmail}\n`;
      telegramMsg += `   👤 Контактна особа: ${order.vatRequest.contactName} (тел: ${order.vatRequest.contactPhone})\n`;
    } else if (order.payment.paymentMethod === 'card') {
      telegramMsg += `   Банківська карта (Онлайн)\n`;
      telegramMsg += `   Статус оплати: ${paymentStatus === 'awaitingPayment' ? 'Очікує оплати' : 'Уточнення вартості'}\n`;
      if (paymentLink) {
        telegramMsg += `   🔗 Посилання на інвойс: <a href="${paymentLink}">Перейти</a>\n`;
      }
    } else {
      telegramMsg += `   Оплата на рахунок ФОП (ручне підтвердження)\n`;
    }
    
    if (order.comment) {
      telegramMsg += `\n💬 <b>Коментар:</b> ${order.comment}\n`;
    }

    // 6. Send Telegram Notification
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      await sendTelegramMessage({
        botToken: env.TELEGRAM_BOT_TOKEN,
        chatId: env.TELEGRAM_CHAT_ID
      }, telegramMsg);
    } else {
      console.log('Telegram Config missing. Message to send:\n', telegramMsg);
    }
    
    // 7. Return success response
    return new Response(JSON.stringify({
      success: true,
      orderId,
      paymentStatus,
      paymentProvider: paymentProviderText,
      paymentLink
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (err: any) {
    console.error('Order handler crashed:', err);
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
