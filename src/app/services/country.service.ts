import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { CountryArrayDataModel,  CountryDataModel} from '../data/countrytab-data-model';
import { COUNTRIES } from '../mock-data/mock-countries';

@Injectable()
export class CountryService {
  //private countryUrl = 'api/country'; //URL to API

 // constructor(private http: HttpClient) { }

 constructor() { }

  getCountries(): CountryArrayDataModel {
//     return of(COUNTRIES);
  return COUNTRIES;
	}

  updateCountries(countries : CountryArrayDataModel) : CountryArrayDataModel {
    //logic to update data
    return countries;
  }

  removeCountry(country : CountryDataModel) : void {
  }

}
