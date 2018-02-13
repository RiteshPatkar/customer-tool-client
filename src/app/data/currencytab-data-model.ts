export class CurrencyArrayDataModel {
  currencies: CurrencyDataModel[];
}

export class CurrencyArrayWithCountryDataModel {
  currencies: CurrencyDataModel[];
  countryCodes : CountryISOCodeArrayDataModel;
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

export class CountryISOCodeArrayDataModel {
  countryCodes: any[]; 
}
