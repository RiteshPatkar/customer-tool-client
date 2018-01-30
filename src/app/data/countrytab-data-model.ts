export class CountryArrayDataModel {
  countries: CountryDataModel[];
//  countryCodes: CountryCodeDataModel[]; 
}

export class CountryDataModel {
  flag = '';
  countryCode = '';
  countryDescription = '';
  currencyISOCode = '';
  postalCodeLength = 0;
  postalCodePosition = '';
}

//export class CountryCodeDataModel {
//	countryCode = '';
//}
