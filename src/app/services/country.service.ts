import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Country } from '../data/country';

@Injectable()
export class CountryService {
  private countryUrl = 'api/country';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    console.log('1');

    console.log(this.http.get<Country[]>(this.countryUrl));

  return this.http.get<Country[]>(this.countryUrl);
}

}
