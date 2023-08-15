import { Injectable } from '@angular/core';
import CurrencyAPI from '@everapi/currencyapi-js';

import { Currency } from "./currency";
import { environment } from '../environments/environment';

const apiKey = `${environment.apiKey}`;
const client  = new CurrencyAPI(apiKey);

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  public async getCurrencies(): Promise<Currency[]> {
    const response = await client.currencies();
    return Object.values(response.data);
  }

  public async getLatestExchangeData(baseCurrencyCode: string, currency: string): Promise<number> {
    const response = await client.latest({ base_currency: baseCurrencyCode, currencies: currency });
    return (Object.values(response.data)[0] as Record<string, number>)["value"] as number;
  }
}
