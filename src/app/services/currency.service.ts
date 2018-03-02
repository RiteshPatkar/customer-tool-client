import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { CurrencyArrayDataModel,  CurrencyDataModel} from '../data/currencytab-data-model';
//import { CURRENCIES } from '../mock-data/mock-currencies';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' })
};

@Injectable()
export class CurrencyService {

 private url = 'http://localhost:8080/currency'; //URL to API

  constructor(private http: HttpClient, private messageService: MessageService) { }

/** GET Currencies Based on userId **/
  getCurrencies(userId : number): Observable<CurrencyArrayDataModel> {
    const url = this.url + '/'+userId;
    return this.http.get<CurrencyArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched currencies for userId = ${userId}`)),
        catchError(this.handleError<CurrencyArrayDataModel>('getCurrencies userId = ${userId}'))
      );
  }

getCurrenciesByCountry(userId : number, countryCodes: String): Observable<CurrencyArrayDataModel> {

//    let inputCountryCodes : '';
//    for(let countryCode of countryCodes) {
//      inputCountryCodes + ',' + countryCode;
//    }
    const url = this.url + '/'+userId + '/' + countryCodes;
    return this.http.get<CurrencyArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched currencies for userId = ${userId}`)),
        catchError(this.handleError<CurrencyArrayDataModel>('getCurrencies userId = ${userId}'))
      );
  }

updateCurrencies(currencies : CurrencyArrayDataModel) : Observable<CurrencyArrayDataModel> {
    const url = this.url + '/';
        return this.http.post<CurrencyArrayDataModel>(url, currencies, httpOptions)
      .pipe(
        tap(_ => this.log(`save ad update currencies`)),
        catchError(this.handleError<CurrencyArrayDataModel>('failure during update countries'))
      );
}

removeCurrency(currency : CurrencyDataModel) : Observable<CurrencyDataModel> {
      let id = currency.id;
      let url = this.url+'/'+id;
      return this.http.delete<CurrencyDataModel>(url, httpOptions)
        .pipe(
        tap(_ => this.log(`delete currency = ${currency}`)),
        catchError(this.handleError<CurrencyDataModel>('delete currency = ${currency}'))
      )
}

    private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

    private log(message: string) {
      this.messageService.add('CurrencyService: ' + message);
  }

}
