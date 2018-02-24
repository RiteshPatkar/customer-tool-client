import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { BankArrayDataModel,  BankDataModel} from '../data/banktab-data-model';
//import { CURRENCIES } from '../mock-data/mock-banks';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' })
};

@Injectable()
export class BankService {

 private url = 'http://localhost:8080/bank'; //URL to API

  constructor(private http: HttpClient, private messageService: MessageService) { }

/** GET Banks Based on userId **/
  getBanks(userId : number): Observable<BankArrayDataModel> {
    const url = this.url + '/'+userId;
    return this.http.get<BankArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched banks for userId = ${userId}`)),
        catchError(this.handleError<BankArrayDataModel>('getBanks userId = ${userId}'))
      );
  }

getBanksByCountry(userId : number, countryCodes: String): Observable<BankArrayDataModel> {

//    let inputCountryCodes : '';
//    for(let countryCode of countryCodes) {
//      inputCountryCodes + ',' + countryCode;
//    }
    const url = this.url + '/'+userId + '/' + countryCodes;
    return this.http.get<BankArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched banks for userId = ${userId}`)),
        catchError(this.handleError<BankArrayDataModel>('getBanks userId = ${userId}'))
      );
  }

updateBanks(banks : BankArrayDataModel) : Observable<BankArrayDataModel> {
    const url = this.url + '/';
        return this.http.post<BankArrayDataModel>(url, banks, httpOptions)
      .pipe(
        tap(_ => this.log(`save ad update banks`)),
        catchError(this.handleError<BankArrayDataModel>('failure during update countries'))
      );
}

removeBank(bank : BankDataModel) : Observable<BankDataModel> {
      let id = bank.id;
      let url = this.url+'/'+id;
      return this.http.delete<BankDataModel>(url, httpOptions)
        .pipe(
        tap(_ => this.log(`delete bank = ${bank}`)),
        catchError(this.handleError<BankDataModel>('delete bank = ${bank}'))
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
      this.messageService.add('BankService: ' + message);
  }

}
