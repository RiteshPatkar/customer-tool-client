import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { CalendarArrayDataModel,  CalendarDataModel} from '../data/calendartab-data-model';
//import { CURRENCIES } from '../mock-data/mock-calendars';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' })
};

@Injectable()
export class CalendarService {

 private url = 'http://localhost:8080/calendar'; //URL to API

  constructor(private http: HttpClient, private messageService: MessageService) { }

/** GET Calendars Based on userId **/
  getCalendars(userId : number): Observable<CalendarArrayDataModel> {
    const url = this.url + '/'+userId;
    return this.http.get<CalendarArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched calendars for userId = ${userId}`)),
        catchError(this.handleError<CalendarArrayDataModel>('getCalendars userId = ${userId}'))
      );
  }

getCalendarsByCountry(userId : number, countryCodes: String): Observable<CalendarArrayDataModel> {

//    let inputCountryCodes : '';
//    for(let countryCode of countryCodes) {
//      inputCountryCodes + ',' + countryCode;
//    }
    const url = this.url + '/'+userId + '/' + countryCodes;
    return this.http.get<CalendarArrayDataModel>(url)
      .pipe(
        tap(_ => this.log(`fetched calendars for userId = ${userId}`)),
        catchError(this.handleError<CalendarArrayDataModel>('getCalendars userId = ${userId}'))
      );
  }

updateCalendars(calendars : CalendarArrayDataModel) : Observable<CalendarArrayDataModel> {
    const url = this.url + '/';
        return this.http.post<CalendarArrayDataModel>(url, calendars, httpOptions)
      .pipe(
        tap(_ => this.log(`save ad update calendars`)),
        catchError(this.handleError<CalendarArrayDataModel>('failure during update countries'))
      );
}

removeCalendar(calendar : CalendarDataModel) : Observable<CalendarDataModel> {
      let id = calendar.id;
      let url = this.url+'/'+id;
      return this.http.delete<CalendarDataModel>(url, httpOptions)
        .pipe(
        tap(_ => this.log(`delete calendar = ${calendar}`)),
        catchError(this.handleError<CalendarDataModel>('delete calendar = ${calendar}'))
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
      this.messageService.add('CalendarService: ' + message);
  }

}
