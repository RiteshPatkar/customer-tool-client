import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { BankBranchArrayDataModel,  BankBranchDataModel} from '../data/bankBranchtab-data-model';
//import { CURRENCIES } from '../mock-data/mock-bankBranchBranches';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' })
};

@Injectable()
export class BankBranchService {

 private url = 'http://localhost:8080/bankBranch'; //URL to API

  constructor(private http: HttpClient, private messageService: MessageService) { }

/** GET BankBranchs Based on userId **/
  getBankBranches(userId : number): Observable<BankBranchArrayDataModel> {
    const url = this.url + '/'+userId;
    alert('in get 1st')
    alert(url)
    return this.http.get<BankBranchArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched bankBranchBranches for userId = ${userId}`)),
        catchError(this.handleError<BankBranchArrayDataModel>('getBankBranchs userId = ${userId}'))
      );
  }

getBankBranchesByCountry(userId : number, countryCodes: String): Observable<BankBranchArrayDataModel> {

//    let inputCountryCodes : '';
//    for(let countryCode of countryCodes) {
//      inputCountryCodes + ',' + countryCode;
//    }
    const url = this.url + '/'+userId + '/' + countryCodes;
    alert('in get ' + url)
    return this.http.get<BankBranchArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched bankBranchBranches for userId = ${userId}`)),
        catchError(this.handleError<BankBranchArrayDataModel>('getBankBranchs userId = ${userId}'))
      );
  }

updateBankBranches(bankBranchBranches : BankBranchArrayDataModel) : Observable<BankBranchArrayDataModel> {
    const url = this.url + '/';
    alert(JSON.stringify(bankBranchBranches, null, 4));
        return this.http.post<BankBranchArrayDataModel>(url, bankBranchBranches, httpOptions)
      .pipe(
        tap(_ => this.log(`save ad update bankBranchBranches`)),
        catchError(this.handleError<BankBranchArrayDataModel>('failure during update countries'))
      );
}

removeBankBranch(bankBranch : BankBranchDataModel) : Observable<BankBranchDataModel> {
      let id = bankBranch.id;
      let url = this.url+'/'+id;
      alert(url);
      return this.http.delete<BankBranchDataModel>(url, httpOptions)
        .pipe(
        tap(_ => this.log(`delete bankBranch = ${bankBranch}`)),
        catchError(this.handleError<BankBranchDataModel>('delete bankBranch = ${bankBranch}'))
      )
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

    private log(message: string) {
      this.messageService.add('BankBranchService: ' + message);
  }

}
