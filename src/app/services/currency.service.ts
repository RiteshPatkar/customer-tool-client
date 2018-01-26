import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { CurrencyArrayDataModel,  CurrencyDataModel} from '../data/currencytab-data-model';
import { CURRENCIES } from '../mock-data/mock-currencies';

@Injectable()
export class CurrencyService {

 // currencies: Currency[];

 constructor() { }

//  getCurrencies(): Observable<CurrencyArrayDataModel> {
//  return of(CURRENCIES);
//	}

//    getCurrenciesByCountry(countryCode: String): Observable<CurrencyArrayDataModel> {
//    return of(CURRENCIES.find(currencies => currencies.countryCode === countryCode));
//  }

getCurrenciesByCountry(countryCodes: String[]): CurrencyArrayDataModel {
//     return of(CURRENCIES);
return CURRENCIES;
  }

updateCurrencies(currencies : CurrencyArrayDataModel) : CurrencyArrayDataModel {
  //logic to update data
  return currencies;
}

removeCurrency(currency : CurrencyDataModel) : void {
}

}
