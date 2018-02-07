export class CountryArrayDataModel {
  userCountries: CountryDataModel[];
//  countryCodes: CountryCodeDataModel[]; 
}

export class CountryDataModel {
  id = 0;
  flag = '';
  countryCode = '';
  countryDescription = '';
  currencyISOCode = '';
  postalCodeLength = 0;
  postalCodePosition = 0;
  userId = '';
}

export class CountryISOCodeArrayDataModel {
  countryCodes: any[]; 
}

