declare module '@everapi/currencyapi-js' {
  export default class CurrencyAPI {
    constructor(apiKey: string);

    latest(options: {
      base_currency: string;
      currencies: string;
    }): Promise<any>;
  }
}
