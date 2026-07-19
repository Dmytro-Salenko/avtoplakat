export interface MonobankConfig {
  apiKey: string;
  merchantId?: string;
  redirectUrl: string;
}

export interface InvoiceRequest {
  amount: number; // in kopecks (cents)
  ccy?: number; // 980 for UAH
  merchantPaymInfo: {
    reference: string;
    destination: string;
    comment: string;
  };
  redirectUrl: string;
}

export async function createMonobankInvoice(config: MonobankConfig, orderId: string, amountUah: number): Promise<{ pageUrl: string; invoiceId: string } | null> {
  // Convert UAH to kopecks (Monobank requirement)
  const amount = Math.round(amountUah * 100);
  
  // If API key is not set, simulate/mock payment gateway
  if (!config.apiKey || config.apiKey === 'your_payment_api_key') {
    console.log('Monobank API key not configured. Simulating payment link.');
    return {
      pageUrl: `https://mock.mono.pay/invoice/${orderId}`,
      invoiceId: `mock_invoice_${orderId}`
    };
  }

  const url = 'https://api.monobank.ua/api/merchant/invoice/create';
  
  try {
    const payload: InvoiceRequest = {
      amount,
      ccy: 980,
      merchantPaymInfo: {
        reference: orderId,
        destination: `Оплата замовлення #${orderId} на сайті AVTOPLAKAT`,
        comment: `Замовлення #${orderId}`
      },
      redirectUrl: config.redirectUrl
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': config.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Monobank API returned error:', errorText);
      return null;
    }

    const data: any = await response.json();
    return {
      pageUrl: data.pageUrl,
      invoiceId: data.invoiceId
    };
  } catch (error) {
    console.error('Failed to connect to Monobank API:', error);
    return null;
  }
}
