import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { CountryArrayDataModel,  CountryDataModel, CountryISOCodeArrayDataModel} from '../data/countrytab-data-model';
//import { COUNTRIES } from '../mock-data/mock-countries';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' })
};

@Injectable()
export class CountryService {
//  private countryUrl = 'http://192.168.0.11:8080/country'; //URL to API
    private countryUrl = 'http://localhost:8080/country'; //URL to API

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /** GET Countries Based on userId **/
  getCountries(userId : number): Observable<CountryArrayDataModel> {
    const url = this.countryUrl + '/user/'+userId;
    alert('in get')
    alert(userId);
    alert(url)
    return this.http.get<CountryArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched countries for userId = ${userId}`)),
        catchError(this.handleError<CountryArrayDataModel>('getCountries userId = ${userId}'))
      );
  }
  
  /** Get ISO COuntry Codes **/
  getCountryCodes() : Observable<CountryISOCodeArrayDataModel> {
    const url = 'http://localhost:8080/isocountry/codes';
    return this.http.get<CountryISOCodeArrayDataModel>(url)
  }

  removeCountry(country : CountryDataModel) : Observable<CountryDataModel> {
    let id = country.id;
    let url = this.countryUrl+'/'+id;
    alert(url);
    return this.http.delete<CountryDataModel>(url, httpOptions)
        .pipe(
        tap(_ => this.log(`delete country = ${country}`)),
        catchError(this.handleError<CountryDataModel>('delete country = ${country}'))
      )
  }
  
  updateCountries(countries : CountryArrayDataModel) : Observable<CountryArrayDataModel> {
    const url = this.countryUrl + '/';
    alert(JSON.stringify(countries, null, 4));
        return this.http.post<CountryArrayDataModel>(url, countries, httpOptions)
      .pipe(
        tap(_ => this.log(`save ad update countries`)),
        catchError(this.handleError<CountryArrayDataModel>('failure during update countries'))
      );
  }
  
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      alert('IN error');
      alert(JSON.stringify(error, null, 4));
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  
   /** Log a CountryService message with the MessageService */
    private log(message: string) {
      this.messageService.add('CountryService: ' + message);
  }

}
