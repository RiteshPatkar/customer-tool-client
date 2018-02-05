export class CountryArrayDataModel {
  userCountries: CountryDataModel[];
//  countryCodes: CountryCodeDataModel[]; 
}

export class CountryDataModel {
  flag = '';
  countryCode = '';
  countryDescription = '';
  currencyISOCode = '';
  postalCodeLength = 0;
  postalCodePosition = '';
  userId = '';
}

export class CountryISOCodeArrayDataModel {
  countryCodes: any[]; 
}

