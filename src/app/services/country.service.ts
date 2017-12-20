import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Country } from '../data/country';
import { COUNTRIES } from '../mock-data/mock-countries';

@Injectable()
export class CountryService {
  //private countryUrl = 'api/country'; //URL to API

 // constructor(private http: HttpClient) { }

 constructor() { }

  getCountries(): Observable<Country[]> {
  return of(COUNTRIES);
	}

}
