import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { CalendarArrayDataModel,  CalendarDataModel} from '../data/calendartab-data-model';
import { CALENDARS } from '../mock-data/mock-calendars';

@Injectable()
export class CalendarService {

 constructor() { }

 getCalendarsByCountry(countryCodes: String[]): CalendarArrayDataModel {
 return CALENDARS;
   }

  updateCalendars(calendars : CalendarArrayDataModel) : CalendarArrayDataModel {
    //logic to update data
    return calendars;
  }

  removeCalendar(calendar : CalendarDataModel) : void {
  }

}
