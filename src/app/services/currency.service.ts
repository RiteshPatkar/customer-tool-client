import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Currency } from '../data/currency';
import { CURRENCIES } from '../mock-data/mock-currencies';

@Injectable()
export class CurrencyService {
  
  currencies: Currency[];

 constructor() { }

  getCurrencies(): Observable<Currency[]> {
  return of(CURRENCIES);
	}
  
    getCurrenciesByCountry(countryCode: String): Observable<Currency> {
    return of(CURRENCIES.find(currencies => currencies.countryCode === countryCode));
  }

}
