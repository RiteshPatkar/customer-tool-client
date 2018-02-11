export class CurrencyArrayDataModel {
  currencies: CurrencyDataModel[];
}

export class CurrencyDataModel {
  id = 0;
  userId = '';
  countryCode = '';
  flag='';
  currencyCode='';
  description='';
  numberOfDecimals=0;
}
