export class BankArrayDataModel {
  banks: BankDataModel[];
}

export class BankDataModel {
  id = 0;
  userId = '';
  bankCode = '';
    countryCode = '';
  description = '';
  interCompany = 0;
  dealIntermediary = 0;
  dealCounterPart = 0;
}

export class CountryISOCodeArrayDataModel {
  countryCodes: any[];
}
