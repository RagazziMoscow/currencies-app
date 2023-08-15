declare module "@everapi/currencyapi-js" {
  // @ts-ignore
  import { Currency } from "../currency";

  class CurrencyAPI {
    constructor(key: string);
    public latest(options: { base_currency: string, currencies: string }): Promise<any>;
    public currencies(): Promise<{ data: Record<string, Currency>}>;
  }

  export = CurrencyAPI;
}
