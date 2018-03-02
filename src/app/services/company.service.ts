import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { CompanyArrayDataModel,  CompanyDataModel} from '../data/companytab-data-model';
// import { COMPANIES } from '../mock-data/mock-companies';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' })
};

@Injectable()
export class CompanyService {

   private url = 'http://localhost:8080/company'; //URL to API

   constructor(private http: HttpClient, private messageService: MessageService) { }

  getCompanies(userId : number): Observable<CompanyArrayDataModel> {
    const url = this.url + '/'+userId;
    return this.http.get<CompanyArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched companies for userId = ${userId}`)),
        catchError(this.handleError<CompanyArrayDataModel>('getCompanies userId = ${userId}'))
      );
  }

  getCompaniesByCountry(userId : number, countryCodes: String): Observable<CompanyArrayDataModel> {

      const url = this.url + '/'+userId + '/' + countryCodes;
      return this.http.get<CompanyArrayDataModel>(url)
        .pipe(
          tap(_ => this.log(`fetched companies for userId = ${userId}`)),
          catchError(this.handleError<CompanyArrayDataModel>('getCompanies userId = ${userId}'))
        );
    }


  updateCompanies(companies : CompanyArrayDataModel) : Observable<CompanyArrayDataModel> {
      const url = this.url + '/';
          return this.http.post<CompanyArrayDataModel>(url, companies, httpOptions)
        .pipe(
          tap(_ => this.log(`save ad update companies`)),
          catchError(this.handleError<CompanyArrayDataModel>('failure during update companies'))
        );
  }

  removeCompany(company : CompanyDataModel) :  Observable<CompanyDataModel> {
        let id = company.id;
        let url = this.url+'/'+id;
        return this.http.delete<CompanyDataModel>(url, httpOptions)
          .pipe(
          tap(_ => this.log(`delete company = ${company}`)),
          catchError(this.handleError<CompanyDataModel>('delete company = ${company}'))
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
    this.messageService.add('CompanyService: ' + message);
}

}
