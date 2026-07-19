export interface NovaPoshtaConfig {
  apiKey: string;
}

export async function estimateShippingCost(config: NovaPoshtaConfig, cityRef: string, warehouseRef: string): Promise<number | null> {
  // If API key is not set, return null or a default mock cost
  if (!config.apiKey || config.apiKey === 'your_api_key_here') {
    return null;
  }

  const url = 'https://api.novaposhta.ua/v2.0/json/';
  
  try {
    const payload = {
      apiKey: config.apiKey,
      modelName: "InternetDocument",
      calledMethod: "getDocumentPrice",
      methodProperties: {
        CitySender: "db5c88f0-391c-11dd-90d9-001a4d12cfbd", // Kyiv (or actual production sender city ref)
        CityRecipient: cityRef,
        Weight: "2.0",
        ServiceType: "WarehouseWarehouse",
        Cost: "600",
        CargoType: "Cargo"
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) return null;
    
    const data: any = await response.json();
    if (data.success && data.data && data.data[0]) {
      return Number(data.data[0].Cost);
    }
    
    return null;
  } catch (error) {
    console.error('Nova Poshta shipping estimation failed:', error);
    return null;
  }
}
