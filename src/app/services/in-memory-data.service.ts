import { InMemoryDbService } from 'angular-in-memory-web-api';
import { COUNTRIES } from '../mock-data/mock-countries';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
//    const countries = COUNTRIES;
    const countries = [
  { flag: 'Y', countryCode: 'US', countryDescription: 'America', currencyISOCode: 'USD', postalCodeLength: 5, postalCodePosition: 'Before' },
  { flag: 'Y', countryCode: 'AD', countryDescription: 'Andorra', currencyISOCode: 'ESP', postalCodeLength: 5, postalCodePosition: 'Before' },
  { flag: 'Y', countryCode: 'AE', countryDescription: 'Arab Ameirites', currencyISOCode: 'AED', postalCodeLength: 10, postalCodePosition: 'Before' },
  { flag: 'Y', countryCode: 'AF', countryDescription: 'Afganistan', currencyISOCode: 'AFN', postalCodeLength: 10, postalCodePosition: 'Before' },
  { flag: 'Y', countryCode: 'AG', countryDescription: 'Antyigua & Barbuda', currencyISOCode: 'XCD', postalCodeLength: 5, postalCodePosition: 'Before' }
];
    return {countries};
  }
}
