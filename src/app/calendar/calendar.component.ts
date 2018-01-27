import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CalendarArrayDataModel,  CalendarDataModel} from '../data/calendartab-data-model';
import { CALENDARS } from '../mock-data/mock-calendars';
import { CalendarService } from '../services/calendar.service';
import { Observable }        from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { IndexKind } from "typescript";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

@Input() calendarArrayData: CalendarArrayDataModel;

calendarFormGroup : FormGroup;
nameChangeLog: string[] = [];
// calendarDataFromService : Observable<CalendarArrayDataModel>;
calendarDataFromService : CalendarArrayDataModel;
isLoading = false;
showNewRow = false;

constructor(
  private calendarFormBuilder : FormBuilder,
  private calendarService: CalendarService) {
  this.createFormGroup();
}

 createFormGroup() {
  this.calendarFormGroup = this.calendarFormBuilder.group({
	calendarsOnScreen : this.calendarFormBuilder.array([])
  });
}

ngOnInit() {
  this.getCalendarsFromService();
  this.setCalendars(this.calendarDataFromService.calendars);
}

getCalendarsFromService() {
  this.isLoading = true;
  this.calendarDataFromService = this.calendarService.getCalendarsByCountry([]);
	  //	.finally(() => this.isLoading = false);
}

 ngOnChanges() {
  this.calendarFormGroup.reset({
  });
	this.setCalendars(this.calendarArrayData.calendars);
}

get calendarsOnScreen(): FormArray {
  return this.calendarFormGroup.get('calendarsOnScreen') as FormArray
}

 setCalendars(calendars : CalendarDataModel[]) {
  const calendarsFormGroups = calendars.map(calendar => this.calendarFormBuilder.group(calendar));
  const calendarFormArray = this.calendarFormBuilder.array(calendarsFormGroups);
  this.calendarFormGroup.setControl('calendarsOnScreen', calendarFormArray);
}

  add() {
  this.showNewRow = true;
  this.calendarsOnScreen.push(this.calendarFormBuilder.group(new CalendarDataModel()));
}

  submit() {
	  this.showNewRow = false;
	  this.calendarArrayData = this.prepareForSubmit();
//    this.calendarService.updateCalendars(this.calendarArrayData).subscribe(/* error handling */);
	  let updatedCalendars = this.calendarService.updateCalendars(this.calendarArrayData);
	  this.ngOnChanges();
}

  prepareForSubmit(): CalendarArrayDataModel {
	  const formModel = this.calendarFormGroup.value;
	  const calendarsOnScreenDeepCopy: CalendarDataModel[] = formModel.calendarsOnScreen.map(
		  (calendar: CalendarDataModel) => Object.assign({}, calendar));
	  const saveCalendarArrayDataModel : CalendarArrayDataModel = {
		  calendars : calendarsOnScreenDeepCopy
	  }

  return saveCalendarArrayDataModel;
}

revert() {
  this.ngOnChanges();
  }

delete(i : number, calendar : CalendarDataModel) {
  this.calendarService.removeCalendar(calendar);
  this.calendarsOnScreen.removeAt(i);
}

//Not used Yet
next() {
if(!this.calendarFormGroup.pristine){
  this.submit();
  }
}
}
