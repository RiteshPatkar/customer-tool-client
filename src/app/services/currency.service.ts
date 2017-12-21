import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Currency } from '../data/currency';
import { CURRENCIES } from '../mock-data/mock-currencies';

@Injectable()
export class CurrencyService {

 constructor() { }

  getCurrencies(): Observable<Currency[]> {
  return of(CURRENCIES);
	}

}
