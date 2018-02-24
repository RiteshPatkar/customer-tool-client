import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { AccountArrayDataModel,  AccountDataModel} from '../data/accounttab-data-model';
//import { CURRENCIES } from '../mock-data/mock-accounts';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' })
};

@Injectable()
export class AccountService {

 private url = 'http://localhost:8080/account'; //URL to API

  constructor(private http: HttpClient, private messageService: MessageService) { }

/** GET Accounts Based on userId **/
  getAccounts(userId : number): Observable<AccountArrayDataModel> {
    const url = this.url + '/'+userId;
    return this.http.get<AccountArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched accounts for userId = ${userId}`)),
        catchError(this.handleError<AccountArrayDataModel>('getAccounts userId = ${userId}'))
      );
  }

getAccountsByCountry(userId : number, countryCodes: String): Observable<AccountArrayDataModel> {

//    let inputCountryCodes : '';
//    for(let countryCode of countryCodes) {
//      inputCountryCodes + ',' + countryCode;
//    }
    const url = this.url + '/'+userId + '/' + countryCodes;
    return this.http.get<AccountArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched accounts for userId = ${userId}`)),
        catchError(this.handleError<AccountArrayDataModel>('getAccounts userId = ${userId}'))
      );
  }

updateAccounts(accounts : AccountArrayDataModel) : Observable<AccountArrayDataModel> {
    const url = this.url + '/';
        return this.http.post<AccountArrayDataModel>(url, accounts, httpOptions)
      .pipe(
        tap(_ => this.log(`save ad update accounts`)),
        catchError(this.handleError<AccountArrayDataModel>('failure during update countries'))
      );
}

removeAccount(account : AccountDataModel) : Observable<AccountDataModel> {
      let id = account.id;
      let url = this.url+'/'+id;
      return this.http.delete<AccountDataModel>(url, httpOptions)
        .pipe(
        tap(_ => this.log(`delete account = ${account}`)),
        catchError(this.handleError<AccountDataModel>('delete account = ${account}'))
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
      this.messageService.add('AccountService: ' + message);
  }

}
